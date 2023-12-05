// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ITankGame } from "src/interfaces/ITankGame.sol";
import { TankGameV2Storage } from "src/base/TankGameV2Storage.sol";
import { Board } from "src/interfaces/IBoard.sol";
import { HexBoard } from "src/base/HexBoard.sol";
import { IHooks } from "src/interfaces/IHooks.sol";
import { MoveLib } from "src/libraries/Move.sol";
import { JoinLib } from "src/libraries/Join.sol";
import { ShootLib } from "src/libraries/Shoot.sol";
import { GiveLib } from "src/libraries/Give.sol";

contract TankGame is ITankGame, TankGameV2Storage {
    using MoveLib for ITankGame.MoveParams;
    using JoinLib for ITankGame.JoinParams;
    using ShootLib for ITankGame.ShootParams;
    using GiveLib for ITankGame.GiveParams;

    address public factory;

    function initialize(ITankGame.GameSettings memory gs, address _owner) public payable override {
        require(gs.boardSize > 0 && gs.boardSize % 3 == 0, "invalid board size");
        require(gs.playerCount > 1, "invalid player count");
        require(gs.epochSeconds > 0, "invalid epoch seconds");
        require(gs.revealWaitBlocks > 0, "invalid reveal wait blocks");
        require(gs.initHearts > 0, "invalid init hearts");
        emit GameInit(gs);
        settings = gs;
        state = GameState.WaitingForPlayers;
        board = new HexBoard(gs.boardSize);
        revealBlock = block.number + gs.revealWaitBlocks;
        owner = _owner;
        factory = msg.sender;
        _handleDonation();
        emit Commit(msg.sender, revealBlock);
    }

    function start() public {
        require(playersCount >= settings.playerCount, "not enough players");
        epochStart = _getEpoch();
        state = GameState.Started;
        emit GameStarted();
    }

    // should do some sort of commit reveal thing for the randomness instead of this
    // random point thing.
    function join(ITankGame.JoinParams calldata params) external payable override {
        // verify join
        params.verifyJoin(players, settings, playersCount);

        // runHooks(IHooks.beforeJoin.selector, playersCount, params);
        Board.Point memory emptyPoint = params.doJoin(board, tanks, players, settings, stateData);
        ///// REMOVE THIS
        playersCount = stateData.playersCount;
        aliveTanksIdSum = stateData.aliveTanksIdSum;
        numTanksAlive = stateData.numTanksAlive;
        ///// REMOVE THIS
        playersCount = stateData.playersCount;
        emit PlayerJoined(params.joiner, playersCount, emptyPoint, params.playerName);

        // runHooks(IHooks.afterJoin.selector, playersCount, abi.encode(params));

        if (settings.autoStart && playersCount == settings.playerCount) {
            start();
        }
    }

    function move(ITankGame.MoveParams calldata params)
        external
        override
        gameStarted
        isTankOwnerOrDelegate(params.tankId)
        isTankAlive(params.tankId)
    {
        uint256 tankId = params.tankId;
        Board.Point memory to = params.to;
        Board.Tile memory tile = board.getTile(to);
        uint256 apsRequired = board.getDistanceTankToPoint(tankId, to);

        // verify move
        params.verifyMove(board, tanks, tile, apsRequired);
        runHooks(IHooks.beforeMove.selector, tankId, abi.encode(params));

        // core logic
        params.doMove(board, tanks, tile, apsRequired);
        emit Move(tankId, to);

        runHooks(IHooks.afterMove.selector, tankId, abi.encode(params));
    }

    function shoot(ITankGame.ShootParams calldata params)
        external
        override
        gameStarted
        isTankOwnerOrDelegate(params.fromId)
        isTankAlive(params.fromId)
        isTankAlive(params.toId)
    {
        uint256 fromId = params.fromId;
        uint256 toId = params.toId;
        params.verifyShoot(tanks, board);

        runHooks(IHooks.beforeShoot.selector, fromId, abi.encode(params));

        emit Shoot(fromId, toId);
        if (params.doShoot(tanks)) {
            // this should really not be in core logic IMO
            // reward the killer with 20% of the victims aps
            uint256 apReward = tanks[toId].aps / 5;
            tanks[fromId].aps += apReward;
            tanks[toId].aps -= apReward;
            emit BountyCompleted(fromId, toId, apReward);
            _handleDeath(fromId, toId);
        }

        // after shoot hooks run here
        runHooks(IHooks.afterShoot.selector, fromId, abi.encode(params));
    }

    function give(ITankGame.GiveParams calldata params)
        external
        override
        gameStarted
        isTankOwnerOrDelegate(params.fromId)
        isTankAlive(params.fromId)
    {
        uint256 fromId = params.fromId;
        uint256 toId = params.toId;
        params.verifyGive(tanks, board);
        runHooks(IHooks.beforeGive.selector, fromId, abi.encode(params));

        (bool fromDead, bool toRevive) = params.doGive(tanks, stateData, lastDripEpoch, _getEpoch());
        // DELETE THIS LATER when all using library
        numTanksAlive = stateData.numTanksAlive;
        aliveTanksIdSum = stateData.aliveTanksIdSum;
        //////
        emit Give(fromId, toId, params.hearts, params.aps);
        if (fromDead) {
            _handleDeath(fromId, fromId);
        }
        if (toRevive) {
            emit Revive(fromId, toId);
        }

        runHooks(IHooks.afterGive.selector, fromId, abi.encode(params));
    }

    function upgrade(ITankGame.UpgradeParams calldata params)
        external
        override
        gameStarted
        isTankOwnerOrDelegate(params.tankId)
        isTankAlive(params.tankId)
    {
        uint256 tankId = params.tankId;
        uint256 upgradeCost = getUpgradeCost(tankId);
        require(upgradeCost <= tanks[tankId].aps, "not enough action points");

        runHooks(IHooks.beforeUpgrade.selector, tankId, abi.encode(params));

        tanks[tankId].aps -= upgradeCost;
        tanks[tankId].range += 1;
        emit Upgrade(tankId, tanks[tankId].range);

        runHooks(IHooks.afterUpgrade.selector, tankId, abi.encode(params));
    }

    function vote(ITankGame.VoteParams calldata params)
        external
        override
        gameStarted
        isTankDead(params.voter)
        isTankAlive(params.cursed)
        isTankOwnerOrDelegate(params.voter)
    {
        uint256 voter = params.voter;
        uint256 cursed = params.cursed;
        uint256 epoch = _getEpoch();
        require(!votedThisEpoch[epoch][voter], "already voted");
        require(votingClosed[epoch] == false, "voting closed");

        runHooks(IHooks.beforeVote.selector, voter, abi.encode(params));

        votesPerEpoch[epoch][cursed] += 1;
        emit Vote(voter, cursed, epoch);
        if (votesPerEpoch[epoch][cursed] >= (deadTanks.length / 2) + 1) {
            if (tanks[cursed].aps > 1) {
                tanks[cursed].aps -= 1;
            } else {
                lastDripEpoch[cursed] = _getLastDrip(cursed) + 1;
            }
            votingClosed[epoch] = true;
            emit Curse(cursed, voter, epoch);
        }
        votedThisEpoch[epoch][voter] = true;

        runHooks(IHooks.afterVote.selector, voter, abi.encode(params));
    }

    function drip(ITankGame.DripParams calldata params) external override gameStarted isTankAlive(params.tankId) {
        uint256 tankId = params.tankId;
        uint256 epoch = _getEpoch();
        require(epoch != epochStart, "too early to drip");
        uint256 lastDrippedEpoch = _getLastDrip(tankId);
        require(epoch > lastDrippedEpoch, "already dripped");

        runHooks(IHooks.beforeDrip.selector, tankId, abi.encode(params));
        uint256 amount = epoch - lastDrippedEpoch;
        tanks[tankId].aps += amount;
        lastDripEpoch[tankId] = epoch;
        emit Drip(tankId, amount, epoch);

        runHooks(IHooks.afterDrip.selector, tankId, abi.encode(params));
    }

    function claim(ITankGame.ClaimParams calldata params) external override isTankOwnerOrDelegate(params.tankId) {
        uint256 tankId = params.tankId;
        address claimer = params.claimer;
        require(state == GameState.Ended, "game not ended");
        require(!claimed[tankId], "already claimed");

        runHooks(IHooks.beforeClaim.selector, tankId, abi.encode(params));

        claimed[tankId] = true;
        // loop is a bit gross, could do a mapping of tank to position on podium
        bool isOnPodium = false;
        for (uint256 i = 0; i < podium.length; i++) {
            if (podium[i] == tankId) {
                // payout structure is 60% 30% 10%. would be nice if there was a sequence
                uint256 p = i == 0 ? 60 : i == 1 ? 30 : 10;
                uint256 placePrize = (prizePool * p) / 100;
                payable(claimer).transfer(placePrize);
                emit Claim(claimer, tankId, placePrize);
                isOnPodium = true;
                break;
            }
        }
        if (!isOnPodium) {
            revert("not on podium");
        }
    }

    function delegate(DelegateParams calldata params) public override isTankOwner(params.tankId) {
        uint256 tankId = params.tankId;
        runHooks(IHooks.beforeDelegate.selector, tankId, abi.encode(params));
        address delegatee = params.delegatee;
        delegates[tankId][delegatee] = true;
        players[delegatee] = tankId;
        emit Delegate(tankId, delegatee, tanks[tankId].owner);
        runHooks(IHooks.afterDelegate.selector, tankId, abi.encode(params));
    }

    function runHooks(bytes4 hookFunction, uint256 tankId, bytes memory params) private {
        for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
            IHooks hook = tankHooks[tankId][i];
            bytes4 selector;
            if (hookFunction == IHooks.beforeDelegate.selector) {
                DelegateParams memory decodedParams = abi.decode(params, (DelegateParams));
                selector = IHooks(hook).beforeDelegate(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.afterDelegate.selector) {
                DelegateParams memory decodedParams = abi.decode(params, (DelegateParams));
                selector = IHooks(hook).afterDelegate(address(this), decodedParams, "");
            // } else if (hookFunction == IHooks.afterJoin.selector) {
            //     JoinParams memory decodedParams = abi.decode(params, (JoinParams));
            //     selector = IHooks(hook).afterJoin(address(this), decodedParams, "");
            // } else if (hookFunction == IHooks.beforeJoin.selector) {
            //     JoinParams memory decodedParams = abi.decode(params, (JoinParams));
            //     selector = IHooks(hook).beforeJoin(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.beforeMove.selector) {
                MoveParams memory decodedParams = abi.decode(params, (MoveParams));
                selector = IHooks(hook).beforeMove(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.afterMove.selector) {
                MoveParams memory decodedParams = abi.decode(params, (MoveParams));
                selector = IHooks(hook).afterMove(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.beforeShoot.selector) {
                ShootParams memory decodedParams = abi.decode(params, (ShootParams));
                selector = IHooks(hook).beforeShoot(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.afterShoot.selector) {
                ShootParams memory decodedParams = abi.decode(params, (ShootParams));
                selector = IHooks(hook).afterShoot(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.beforeGive.selector) {
                GiveParams memory decodedParams = abi.decode(params, (GiveParams));
                selector = IHooks(hook).beforeGive(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.afterGive.selector) {
                GiveParams memory decodedParams = abi.decode(params, (GiveParams));
                selector = IHooks(hook).afterGive(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.beforeUpgrade.selector) {
                UpgradeParams memory decodedParams = abi.decode(params, (UpgradeParams));
                selector = IHooks(hook).beforeUpgrade(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.afterUpgrade.selector) {
                UpgradeParams memory decodedParams = abi.decode(params, (UpgradeParams));
                selector = IHooks(hook).afterUpgrade(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.beforeVote.selector) {
                VoteParams memory decodedParams = abi.decode(params, (VoteParams));
                selector = IHooks(hook).beforeVote(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.afterVote.selector) {
                VoteParams memory decodedParams = abi.decode(params, (VoteParams));
                selector = IHooks(hook).afterVote(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.beforeDrip.selector) {
                DripParams memory decodedParams = abi.decode(params, (DripParams));
                selector = IHooks(hook).beforeDrip(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.afterDrip.selector) {
                DripParams memory decodedParams = abi.decode(params, (DripParams));
                selector = IHooks(hook).afterDrip(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.beforeClaim.selector) {
                ClaimParams memory decodedParams = abi.decode(params, (ClaimParams));
                selector = IHooks(hook).beforeClaim(address(this), decodedParams, "");
            } else if (hookFunction == IHooks.afterClaim.selector) {
                ClaimParams memory decodedParams = abi.decode(params, (ClaimParams));
                selector = IHooks(hook).afterClaim(address(this), decodedParams, "");
            } else {
                revert("Invalid hook function");
            }
            require(selector == hookFunction, "invalid hook");
        }
    }

    function reveal() public override gameStarted {
        require(block.number >= revealBlock, "not ready to reveal");
        emit Reveal(msg.sender, revealBlock);
        // as long as we are within 256 blocks, we can reveal
        if (block.number - revealBlock <= 256) {
            _spawnResource();
        }
        revealBlock = block.number + settings.revealWaitBlocks;
        emit Commit(msg.sender, revealBlock);
    }

    function addHooks(uint256 tankId, IHooks hooks) external override isTankOwnerOrDelegate(tankId) {
        require(address(hooks) != address(0), "invalid address");
        // only accept a hook once, max length here at default is numPlayers * numDefaultHooks
        for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
            require(address(tankHooks[tankId][i]) != address(hooks), "hook already added");
        }
        tankHooks[tankId].push(hooks);
        emit HooksAdded(tankId, address(hooks));
    }

    function donate() external payable {
        require(msg.value > 0, "no value sent");
        _handleDonation();
    }

    function forceAddDefaultHook(uint256 tankId, IHooks hooks) external {
        require(msg.sender == owner || msg.sender == factory, "not owner");
        tankHooks[tankId].push(hooks);
        emit HooksAdded(tankId, address(hooks));
    }

    /*//////////////////////////////////////////////////////////////
                                 Internal
    //////////////////////////////////////////////////////////////*/
    function _handleDeath(uint256 killer, uint256 tankId) private {
        numTanksAlive--;
        stateData.numTanksAlive--;
        stateData.aliveTanksIdSum -= tankId;
        aliveTanksIdSum -= tankId;
        deadTanks.push(tankId);
        emit Death(killer, tankId);
        if (numTanksAlive == 1) {
            podium[1] = deadTanks[deadTanks.length - 1];
            if (deadTanks.length > 1) {
                podium[2] = deadTanks[deadTanks.length - 2];
            }
            // since we know that there is only 1 remaining tank
            // we can set the first podium position to the sum of all alive tanks
            // can't trust the `from` because you can kill yourself
            podium[0] = aliveTanksIdSum;
            state = GameState.Ended;
            emit GameOver(podium[0], podium[1], podium[2], prizePool);
        }
    }

    function _spawnResource() private {
        uint256 seed = uint256(blockhash(revealBlock));
        Board.Point memory randomTile = board.getEmptyTile(seed);
        board.setTile(randomTile, Board.Tile({ tankId: 0, hearts: 1 }));
        emit SpawnHeart(msg.sender, randomTile);
    }

    function _getEpoch() public view returns (uint256) {
        return block.timestamp / settings.epochSeconds;
    }

    function _handleDonation() internal {
        prizePool += msg.value;
        emit PrizeIncrease(msg.sender, msg.value, address(this).balance);
    }

    /*//////////////////////////////////////////////////////////////
                                 READ ONLY
    //////////////////////////////////////////////////////////////*/
    function setOwner(address _owner) external {
        require(msg.sender == owner, "not owner");
        owner = _owner;
    }

    modifier gameStarted() {
        require(state == GameState.Started, "game not started");
        _;
    }

    modifier isTankOwner(uint256 tankId) {
        require(tanks[tankId].owner == msg.sender, "not tank owner");
        _;
    }

    modifier isTankOwnerOrDelegate(uint256 tankId) {
        require(isAuth(tankId, msg.sender), "not tank owner or delegate");
        _;
    }

    modifier isTankAlive(uint256 tankId) {
        require(tanks[tankId].hearts > 0, "tank is dead");
        _;
    }

    modifier isTankDead(uint256 tankId) {
        require(tanks[tankId].hearts == 0, "tank is alive");
        _;
    }

    function isAuth(uint256 tankId, address _owner) public view returns (bool) {
        return tanks[tankId].owner == _owner || delegates[tankId][_owner];
    }

    function _getLastDrip(uint256 tankId) internal view returns (uint256) {
        uint256 lastDrippedEpoch = lastDripEpoch[tankId];
        return lastDrippedEpoch = lastDrippedEpoch > 0 ? lastDrippedEpoch : epochStart;
    }

    function getLastDrip(uint256 tankId) external view returns (uint256) {
        return _getLastDrip(tankId);
    }

    function getUpgradeCost(uint256 tankId) public view returns (uint256) {
        // 12, 18, 24, 30, 36, 42, 48, 54, 60
        return board.getPerimeterForRadius(tanks[tankId].range) - 6;
    }
}
