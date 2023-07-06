// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ITankGame } from "src/interfaces/ITankGame.sol";
import { TankGameV2Storage } from "src/base/TankGameV2Storage.sol";
import { Board } from "src/interfaces/IBoard.sol";
import { HexBoard } from "src/base/HexBoard.sol";

contract TankGame is ITankGame, TankGameV2Storage {
    event GameStarted();
    event PlayerJoined(address player, uint256 x, uint256 y, uint256 z);
    event Move(uint256 tankId, uint256 x, uint256 y, uint256 z);
    event Shoot(uint256 tankId, uint256 targetId);
    event Give(uint256 fromId, uint256 toId, uint256 hearts, uint256 aps);
    event Upgrade(uint256 tankId, uint256 range);
    event Vote(uint256 voter, uint256 cursed, uint256 epoch);
    event Curse(uint256 cursedTank, uint256 voter, uint256 epoch);
    event Drip(uint256 tankId, uint256 amount);
    event Claim(address reciever, uint256 tankId, uint256 amount);
    event PrizeIncrease(address donator, uint256 amount);
    event Death(uint256 killer, uint256 killed);
    event Revive(uint256 savior, uint256 saved);
    event SpawnHeart(address poker, uint256 x, uint256 y, uint256 z);
    event RevealSet(address poker, uint256 blocknumber);
    event Delegate(uint256 tank, address delegate, address owner);
    event GameOver(uint256 winner, uint256 second, uint256 third, uint256 prizePool);

    constructor(ITankGame.GameSettings memory gs) payable {
        settings = gs;
        state = GameState.WaitingForPlayers;
        prizePool = msg.value;
        board = new HexBoard(gs.boardSize);
    }

    function donate() external payable {
        prizePool += msg.value;
        emit PrizeIncrease(msg.sender, msg.value);
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

    // should do some sort of commit reveal thing for the randomness instead of this
    // random point thing
    function join() external payable {
        require(players[msg.sender] == 0, "already joined");
        require(playersCount < settings.playerCount, "game is full");
        require(msg.value >= settings.buyInMinimum, "insufficient buy in");

        // this is manipulatable.
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
        Board.Point memory emptyPoint = board.getEmptyTile(seed);
        Tank memory tank = Tank(msg.sender, settings.initHearts, settings.initAPs, settings.initShootRange);

        playersCount++;
        numTanksAlive++;
        aliveTanksIdSum += playersCount;
        tanks[playersCount] = tank;
        players[msg.sender] = playersCount;
        board.setTile(emptyPoint, Board.Tile(playersCount, 0));
        if (playersCount >= settings.playerCount) {
            epochStart = _getEpoch();
            state = GameState.Started;
            emit GameStarted();
        }
        emit PlayerJoined(msg.sender, emptyPoint.x, emptyPoint.y, emptyPoint.z);
    }

    function move(
        uint256 tankId,
        Board.Point calldata to
    )
        external
        gameStarted
        isTankOwnerOrDelegate(tankId)
        isTankAlive(tankId)
    {
        if (to.x >= settings.boardSize || to.y >= settings.boardSize) {
            revert("out of bounds");
        }
        Board.Tile memory tile = board.getTile(to);
        if (tile.tankId != 0) {
            revert("position occupied");
        }

        uint256 apsRequired = board.getDistanceTankToPoint(tankId, to);
        if (apsRequired > tanks[tankId].aps) {
            revert("not enough action points");
        }

        tanks[tankId].hearts += tile.hearts;
        tanks[tankId].aps -= apsRequired;
        board.setTile(to, Board.Tile(tankId, 0));
        emit Move(tankId, to.x, to.y, tile.hearts);
    }

    function shoot(
        uint256 fromId,
        uint256 toId,
        uint256 shots
    )
        external
        gameStarted
        isTankOwnerOrDelegate(fromId)
        isTankAlive(fromId)
        isTankAlive(toId)
    {
        uint256 distance = board.getDistanceTanks(fromId, toId);
        require(distance <= tanks[fromId].range, "target out of range");
        require(tanks[fromId].aps >= shots, "not enough action points");
        require(shots <= tanks[toId].hearts, "too many shots");

        tanks[fromId].aps -= shots;
        tanks[toId].hearts -= shots;
        if (tanks[toId].hearts <= 0) {
            numTanksAlive--;
            emit Death(fromId, toId);
            deadTanks.push(toId);
            aliveTanksIdSum -= toId;
            if (numTanksAlive == 1) {
                podium[1] = deadTanks[deadTanks.length - 1];
                podium[2] = deadTanks[deadTanks.length - 2];
                // since we know that there is only 1 remaining tank
                // we can set the first podium position to the sum of all alive tanks
                podium[0] = aliveTanksIdSum;
            }
        }
        emit Shoot(fromId, toId);
    }

    function give(
        uint256 fromId,
        uint256 toId,
        uint256 hearts,
        uint256 aps
    )
        external
        gameStarted
        isTankOwnerOrDelegate(fromId)
        isTankAlive(fromId)
    {
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
    }

    function upgrade(uint256 tankId) external gameStarted isTankOwnerOrDelegate(tankId) isTankAlive(tankId) {
        uint256 range = tanks[tankId].range;
        // upgrading is equivalent to moving in all direction by 1, permanently.
        // this means each upgrade gives access to the new perimeter of the range.
        // since its permanent, we should charge extra for it.
        // extra 10% of the perimeter seems reasonable?
        uint256 upgradeCost = board.getPerimeterForRadius(range + 1) + (board.getPerimeterForRadius(range + 1) / 10);
        require(upgradeCost <= tanks[tankId].aps, "not enough action points");
        tanks[tankId].aps -= upgradeCost;
        tanks[tankId].range += 1;
        emit Upgrade(tankId, tanks[tankId].range);
    }

    function vote(uint256 voter, uint256 cursed) external gameStarted isTankDead(voter) isTankOwnerOrDelegate(voter) {
        uint256 epoch = _getEpoch();
        require(votesPerEpoch[epoch][voter] == 0, "already voted");
        require(votingClosed[epoch] == false, "voting closed");

        votesPerEpoch[epoch][cursed] += 1;
        if (votesPerEpoch[epoch][cursed] > (deadTanks.length / 2) + 1) {
            tanks[cursed].aps -= 1;
            votingClosed[epoch] = true;
            emit Curse(cursed, voter, epoch);
        }
        votedThisEpoch[epoch][voter] = true;
        emit Vote(voter, cursed, epoch);
    }

    function drip(uint256 tankId) external gameStarted isTankOwnerOrDelegate(tankId) isTankAlive(tankId) {
        uint256 epoch = _getEpoch();
        if (epoch == epochStart) {
            revert("too early to drip");
        }
        uint256 lastDrippedEpoch = lastDripEpoch[tankId];
        lastDrippedEpoch = lastDrippedEpoch > 0 ? lastDrippedEpoch : epochStart;
        if (epoch == lastDrippedEpoch) {
            revert("already dripped");
        }
        uint256 amount = epoch - lastDrippedEpoch;
        tanks[tankId].aps += amount;

        lastDripEpoch[tankId] = epoch;
        emit Drip(tankId, amount);
    }

    function claim(uint256 tankId, address claimer) external isTankOwner(tankId) {
        if (state != GameState.Ended) {
            revert("game not ended");
        }
        // loop is a bit gross, could do a mapping of tank to position on podium
        for (uint256 i = 0; i < podium.length; i++) {
            if (podium[i] == tankId) {
                // payout structure is 60% 30% 10%. would be nice if there was a sequence
                podium[i] = 0; // clear podium for reentrency
                uint256 p = i == 0 ? 60 : i == 1 ? 30 : 10;
                uint256 placePrize = (prizePool * p) / 100;
                payable(claimer).transfer(placePrize);
                emit Claim(claimer, tankId, placePrize);
                return;
            }
        }
        revert("tank not on podium");
    }

    function delegate(uint256 tankId, address delegatee) public isTankOwner(tankId) {
        delegates[tankId][delegatee] = true;
        emit Delegate(tankId, delegatee, tanks[tankId].owner);
    }

    function commit() public gameStarted {
        require(block.number <= revealBlock, "already commit");
        require(block.number - settings.spawnerCooldown > lastRevealBlock, "cooling down");
        revealBlock = block.number + settings.revealWaitBlocks;
    }

    function reveal() public {
        require(block.number >= revealBlock, "not ready to reveal");
        // as long as we are within 256 blocks, we can reveal
        if (block.number - revealBlock <= 256) {
            spawnResource();
        }
        revealBlock = block.number + settings.revealWaitBlocks + settings.spawnerCooldown;
        emit RevealSet(msg.sender, revealBlock);
    }

    function spawnResource() private {
        uint256 seed = uint256(blockhash(revealBlock));
        Board.Point memory randomTile = board.getEmptyTile(seed);
        board.setTile(randomTile, Board.Tile(0, 1));
        emit SpawnHeart(msg.sender, randomTile.x, randomTile.y, randomTile.z);
    }

    /// helpers ///
    function _getEpoch() internal view returns (uint256) {
        return block.timestamp / settings.epochSeconds;
    }

    function getEpoch() external view returns (uint256) {
        return _getEpoch();
    }

    /// readonly stuff used for frontend, move this to a view contract ///
    struct TankLocation {
        Tank tank;
        Board.Point position;
        uint256 tankId;
    }

    function getAllTanks() external view returns (TankLocation[] memory) {
        TankLocation[] memory tanksWithLocation = new TankLocation[](
            playersCount
        );
        for (uint256 i = 1; i <= playersCount; i++) {
            Board.Point memory position = board.getTankPosition(i);
            Tank memory tank = tanks[i];
            tanksWithLocation[i - 1] = TankLocation(tank, position, i);
        }
        return tanksWithLocation;
    }
}
