// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { TankGameV2Storage } from "src/base/TankGameV2Storage.sol";
import { Board } from "src/interfaces/IBoard.sol";
import { HexBoard } from "src/base/HexBoard.sol";

contract TankGame is ITankGame, TankGameV2Storage {
    event GameInit(ITankGame.GameSettings settings);
    event GameStarted();
    event PlayerJoined(address player, uint256 tankId, Board.Point position, string name);
    event Move(uint256 tankId, Board.Point position);
    event Shoot(uint256 tankId, uint256 targetId);
    event Give(uint256 fromId, uint256 toId, uint256 hearts, uint256 aps);
    event Upgrade(uint256 tankId, uint256 range);
    event Vote(uint256 voter, uint256 cursed, uint256 epoch);
    event Curse(uint256 cursedTank, uint256 voter, uint256 epoch);
    event Drip(uint256 tankId, uint256 amount, uint256 epoch);
    event Claim(address reciever, uint256 tankId, uint256 amount);
    event PrizeIncrease(address donator, uint256 amount, uint256 newTotal);
    event Death(uint256 killer, uint256 killed);
    event Revive(uint256 savior, uint256 saved);
    event SpawnHeart(address poker, Board.Point position);
    event Reveal(address poker, uint256 blocknumber);
    event Commit(address poker, uint256 blocknumber);
    event Delegate(uint256 tank, address delegate, address owner);
    event GameOver(uint256 winner, uint256 second, uint256 third, uint256 prizePool);
    event BountyCompleted(uint256 hunter, uint256 victim, uint256 reward);

    constructor(ITankGame.GameSettings memory gs) payable {
        require(gs.boardSize % 3 == 0, "invalid board size");
        emit GameInit(gs);
        settings = gs;
        state = GameState.WaitingForPlayers;
        board = new HexBoard(gs.boardSize);
        revealBlock = block.number + gs.revealWaitBlocks;
        owner = msg.sender;
        _handleDonation();
        emit Commit(msg.sender, revealBlock);
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
        require(tanks[tankId].owner == msg.sender || delegates[tankId][msg.sender], "not tank owner or delegate");
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

    function donate() external payable {
        require(msg.value > 0, "no value sent");
        _handleDonation();
    }

    function _handleDonation() internal {
        prizePool += msg.value;
        emit PrizeIncrease(msg.sender, msg.value, address(this).balance);
    }

    // should do some sort of commit reveal thing for the randomness instead of this
    // random point thing.
    function join(ITankGame.JoinParams calldata params) external override payable {
        require(players[params.joiner] == 0, "already joined");
        require(playersCount < settings.playerCount, "game is full");
        require(msg.value >= settings.buyInMinimum, "insufficient buy in");
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(params.joiner, params.playerName))));
        require(settings.root == bytes32(0) || MerkleProof.verify(params.proof, settings.root, leaf), "invalid proof");

        // this is manipulatable.
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, params.joiner)));
        Board.Point memory emptyPoint = board.getEmptyTile(seed);
        Tank memory tank = Tank(params.joiner, settings.initHearts, settings.initAPs, settings.initShootRange);

        playersCount++;
        numTanksAlive++;
        aliveTanksIdSum += playersCount;
        tanks[playersCount] = tank;
        players[params.joiner] = playersCount;
        board.setTile(emptyPoint, Board.Tile({ tankId: playersCount, hearts: 0 }));
        emit PlayerJoined(params.joiner, playersCount, emptyPoint, params.playerName);
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
        require(board.isValidPoint(to), "invalid point");
        Board.Tile memory tile = board.getTile(to);
        require(tile.tankId == 0, "position occupied");
        uint256 apsRequired = board.getDistanceTankToPoint(tankId, to);
        require(apsRequired <= tanks[tankId].aps, "not enough action points");

        tanks[tankId].hearts += tile.hearts;
        tanks[tankId].aps -= apsRequired;
        Board.Point memory from = board.getTankPosition(tankId);
        board.setTile(to, Board.Tile({ tankId: tankId, hearts: 0 }));
        board.setTile(from, Board.Tile({ tankId: 0, hearts: 0 }));
        emit Move(tankId, to);
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
        uint256 shots = params.shots;
        uint256 distance = board.getDistanceTanks(fromId, toId);
        require(distance <= tanks[fromId].range, "target out of range");
        require(tanks[fromId].aps >= shots, "not enough action points");
        require(shots <= tanks[toId].hearts, "too many shots");

        tanks[fromId].aps -= shots;
        tanks[toId].hearts -= shots;
        emit Shoot(fromId, toId);
        if (tanks[toId].hearts <= 0) {
            // reward the killer with 20% of the victims aps
            uint256 apReward = tanks[toId].aps / 5;
            tanks[fromId].aps += apReward;
            tanks[toId].aps -= apReward;
            emit BountyCompleted(fromId, toId, apReward);

            _handleDeath(fromId, toId);
        }
    }

    function give(ITankGame.GiveParams calldata params)
        external
        gameStarted
        isTankOwnerOrDelegate(params.fromId)
        isTankAlive(params.fromId)
    {
        uint256 hearts = params.hearts;
        uint256 aps = params.aps;
        uint256 fromId = params.fromId;
        uint256 toId = params.toId;
        require(hearts <= tanks[fromId].hearts, "not enough hearts");
        require(aps <= tanks[fromId].aps, "not enough action points");
        uint256 distance = board.getDistanceTanks(fromId, toId);
        require(distance <= tanks[fromId].range, "target out of range");

        tanks[fromId].hearts -= hearts;
        tanks[fromId].aps -= aps;
        if (tanks[toId].hearts <= 0) {
            emit Revive(fromId, toId);
            numTanksAlive++;
            aliveTanksIdSum += toId;
            // reset the epoch to the current one
            lastDripEpoch[toId] = _getEpoch();
        }
        tanks[toId].hearts += hearts;
        tanks[toId].aps += aps;
        emit Give(fromId, toId, hearts, aps);
        if (tanks[fromId].hearts == 0) {
            _handleDeath(fromId, fromId);
        }
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
        tanks[tankId].aps -= upgradeCost;
        tanks[tankId].range += 1;
        emit Upgrade(tankId, tanks[tankId].range);
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
    }

    function drip(ITankGame.DripParams calldata params) external override gameStarted isTankAlive(params.tankId) {
        uint256 tankId = params.tankId;
        uint256 epoch = _getEpoch();

        require(epoch != epochStart, "too early to drip");
        uint256 lastDrippedEpoch = _getLastDrip(tankId);
        require(epoch > lastDrippedEpoch, "already dripped");
        uint256 amount = epoch - lastDrippedEpoch;
        tanks[tankId].aps += amount;

        lastDripEpoch[tankId] = epoch;
        emit Drip(tankId, amount, epoch);
    }

    function claim(ITankGame.ClaimParams calldata params) external override isTankOwner(params.tankId) {
        uint256 tankId = params.tankId;
        address claimer = params.claimer;
        require(state == GameState.Ended, "game not ended");
        require(!claimed[tankId], "already claimed");
        claimed[tankId] = true;
        // loop is a bit gross, could do a mapping of tank to position on podium
        for (uint256 i = 0; i < podium.length; i++) {
            if (podium[i] == tankId) {
                // payout structure is 60% 30% 10%. would be nice if there was a sequence
                uint256 p = i == 0 ? 60 : i == 1 ? 30 : 10;
                uint256 placePrize = (prizePool * p) / 100;
                payable(claimer).transfer(placePrize);
                emit Claim(claimer, tankId, placePrize);
                return;
            }
        }
        revert("tank not on podium");
    }

    function delegate(DelegateParams calldata params) public override isTankOwner(params.tankId) {
        uint256 tankId = params.tankId;
        address delegatee = params.delegatee;
        delegates[tankId][delegatee] = true;
        emit Delegate(tankId, delegatee, tanks[tankId].owner);
    }

    function reveal() public override  {
        require(block.number >= revealBlock, "not ready to reveal");
        emit Reveal(msg.sender, revealBlock);
        // as long as we are within 256 blocks, we can reveal
        if (block.number - revealBlock <= 256) {
            _spawnResource();
        }
        revealBlock = block.number + settings.revealWaitBlocks;
        emit Commit(msg.sender, revealBlock);
    }

    function _handleDeath(uint256 killer, uint256 tankId) private {
        numTanksAlive--;
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

    function getEpoch() external view returns (uint256) {
        return _getEpoch();
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
