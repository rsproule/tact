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

    constructor(ITankGame.GameSettings memory gs, address _owner) payable {
        require(gs.boardSize % 3 == 0, "invalid board size");
        emit GameInit(gs);
        settings = gs;
        state = GameState.WaitingForPlayers;
        board = new HexBoard(gs.boardSize);
        revealBlock = block.number + gs.revealWaitBlocks;
        owner = _owner;
        _handleDonation();
        emit Commit(msg.sender, revealBlock);
    }

    // should do some sort of commit reveal thing for the randomness instead of this
    // random point thing.
    function join(ITankGame.JoinParams calldata params) external payable override {
        // verify join
        params.verifyJoin(players, settings, playersCount);

        Board.Point memory emptyPoint = params.doJoin(board, tanks, players, settings, stateData);
        ///// REMOVE THIS
        playersCount = stateData.playersCount;
        aliveTanksIdSum = stateData.aliveTanksIdSum;
        numTanksAlive = stateData.numTanksAlive;
        ///// REMOVE THIS
        playersCount = stateData.playersCount;
        emit PlayerJoined(params.joiner, playersCount, emptyPoint, params.playerName);

        // after join
        // before join hooks run here
        for (uint256 i = 0; i < tankHooks[playersCount].length; i++) {
            IHooks hook = tankHooks[playersCount][i];
            bytes4 selector = IHooks(hook).afterJoin(address(this), params, "");
            require(selector == IHooks.afterJoin.selector, "invalid hook");
        }
    }

    function start() external {
        require(playersCount >= settings.playerCount, "not enough players");
        epochStart = _getEpoch();
        state = GameState.Started;
        emit GameStarted();
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

        // before move hooks run here
        for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
            IHooks hook = tankHooks[tankId][i];
            bytes4 selector = IHooks(hook).beforeMove(address(this), params, "");
            require(selector == IHooks.beforeMove.selector, "invalid hook");
        }

        // core logic
        params.doMove(board, tanks, tile, apsRequired);
        emit Move(tankId, to);

        // after ove hooks run here
        for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
            IHooks hook = tankHooks[tankId][i];
            bytes4 selector = IHooks(hook).afterMove(address(this), params, "");
            require(selector == IHooks.afterMove.selector, "invalid hook");
        }
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

        // before shoot hooks run here
        for (uint256 i = 0; i < tankHooks[fromId].length; i++) {
            IHooks hook = tankHooks[fromId][i];
            bytes4 selector = IHooks(hook).beforeShoot(address(this), params, "");
            require(selector == IHooks.beforeShoot.selector, "invalid hook");
        }

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
        for (uint256 i = 0; i < tankHooks[fromId].length; i++) {
            IHooks hook = tankHooks[fromId][i];
            bytes4 selector = hook.afterShoot(address(this), params, "");
            require(selector == IHooks.afterShoot.selector, "invalid hook");
        }
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
        // before give hooks run here
        // for (uint256 i = 0; i < tankHooks[fromId].length; i++) {
        //     IHooks hook = tankHooks[fromId][i];
        //     bytes4 selector = IHooks(hook).beforeGive(address(this), params, "");
        //     require(selector == IHooks.beforeGive.selector, "invalid hook");
        // }

        (bool fromDead, bool toRevive) = params.doGive(tanks, stateData, lastDripEpoch, _getEpoch());
        // DELETE THIS LATER
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

        // after give hooks run here
        // for (uint256 i = 0; i < tankHooks[fromId].length; i++) {
        //     IHooks hook = tankHooks[fromId][i];
        //     bytes4 selector = IHooks(hook).afterGive(address(this), params, "");
        //     require(selector == IHooks.afterGive.selector, "invalid hook");
        // }
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

        // for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
        //     IHooks hook = tankHooks[tankId][i];
        //     bytes4 selector = IHooks(hook).beforeUpgrade(address(this), params, "");
        //     require(selector == IHooks.beforeUpgrade.selector, "invalid hook");
        // }

        tanks[tankId].aps -= upgradeCost;
        tanks[tankId].range += 1;
        emit Upgrade(tankId, tanks[tankId].range);

        // for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
        //     IHooks hook = tankHooks[tankId][i];
        //     bytes4 selector = IHooks(hook).afterUpgrade(address(this), params, "");
        //     require(selector == IHooks.afterUpgrade.selector, "invalid hook");
        // }
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

        // for (uint256 i = 0; i < tankHooks[voter].length; i++) {
        //     IHooks hook = tankHooks[voter][i];
        //     bytes4 selector = IHooks(hook).beforeVote(address(this), params, "");
        //     require(selector == IHooks.beforeVote.selector, "invalid hook");
        // }

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

        // for (uint256 i = 0; i < tankHooks[voter].length; i++) {
        //     IHooks hook = tankHooks[voter][i];
        //     bytes4 selector = IHooks(hook).afterVote(address(this), params, "");
        //     require(selector == IHooks.afterVote.selector, "invalid hook");
        // }
    }

    function drip(ITankGame.DripParams calldata params) external override gameStarted isTankAlive(params.tankId) {
        uint256 tankId = params.tankId;
        uint256 epoch = _getEpoch();
        require(epoch != epochStart, "too early to drip");
        uint256 lastDrippedEpoch = _getLastDrip(tankId);
        require(epoch > lastDrippedEpoch, "already dripped");

        // for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
        //     IHooks hook = tankHooks[tankId][i];
        //     bytes4 selector = IHooks(hook).beforeDrip(address(this), params, "");
        //     require(selector == IHooks.beforeDrip.selector, "invalid hook");
        // }

        uint256 amount = epoch - lastDrippedEpoch;
        tanks[tankId].aps += amount;
        lastDripEpoch[tankId] = epoch;
        emit Drip(tankId, amount, epoch);

        // for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
        //     IHooks hook = tankHooks[tankId][i];
        //     bytes4 selector = IHooks(hook).afterDrip(address(this), params, "");
        //     require(selector == IHooks.afterDrip.selector, "invalid hook");
        // }
    }

    function claim(ITankGame.ClaimParams calldata params) external override isTankOwnerOrDelegate(params.tankId) {
        uint256 tankId = params.tankId;
        address claimer = params.claimer;
        require(state == GameState.Ended, "game not ended");
        require(!claimed[tankId], "already claimed");

        // for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
        //     IHooks hook = tankHooks[tankId][i];
        //     bytes4 selector = IHooks(hook).beforeClaim(address(this), params, "");
        //     require(selector == IHooks.beforeClaim.selector, "invalid hook");
        // }

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

        // for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
        //     IHooks hook = tankHooks[tankId][i];
        //     bytes4 selector = IHooks(hook).afterClaim(address(this), params, "");
        //     require(selector == IHooks.afterClaim.selector, "invalid hook");
        // }
    }

    function delegate(DelegateParams calldata params) public override isTankOwner(params.tankId) {
        uint256 tankId = params.tankId;
        for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
            IHooks hook = tankHooks[tankId][i];
            bytes4 selector = IHooks(hook).beforeDelegate(address(this), params, "");
            require(selector == IHooks.beforeDelegate.selector, "invalid hook");
        }
        address delegatee = params.delegatee;
        delegates[tankId][delegatee] = true;
        players[delegatee] = tankId;
        emit Delegate(tankId, delegatee, tanks[tankId].owner);
        for (uint256 i = 0; i < tankHooks[tankId].length; i++) {
            IHooks hook = tankHooks[tankId][i];
            bytes4 selector = IHooks(hook).afterDelegate(address(this), params, "");
            require(selector == IHooks.afterDelegate.selector, "invalid hook");
        }
    }

    function reveal() public override {
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
        require(msg.sender == owner, "not owner");
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
            podium[2] = deadTanks[deadTanks.length - 2];
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

    function _getEpoch() internal view returns (uint256) {
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

    function isAuth(uint256 tankId, address _owner) public view override returns (bool) {
        return tanks[tankId].owner == _owner || delegates[tankId][_owner];
    }

    function getState() external view override returns (ITankGame.GameState) {
        return state;
    }

    function getEpoch() external view override returns (uint256) {
        return _getEpoch();
    }

    function getGameEpoch() external view override returns (uint256) {
        if (state == GameState.WaitingForPlayers) {
            return 0; // this is cuz epoch start would be 0
        }
        return _getEpoch() - epochStart;
    }

    function getTank(uint256 tankId) external view returns (Tank memory) {
        return tanks[tankId];
    }

    function getPlayerCount() external view returns (uint256) {
        return playersCount;
    }

    function getBoard() external view returns (Board) {
        return board;
    }

    function getSettings() external view returns (ITankGame.GameSettings memory) {
        return settings;
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
