// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "./ITankGame.sol";

contract TankGame is ITankGame {
    // mapping of owner to tank id
    mapping(address => uint) public players;
    // tanks by id
    mapping(uint => Tank) public tanks;
    // tank id to position
    mapping(uint => Point) public tankToPosition;
    // position to hearts on board
    mapping(uint => uint) public heartsOnBoard;
    // position to tanks id on board
    mapping(uint => uint) public tanksOnBoard;
    // mapping(uint => uint) public actionPointsOnBoard;
    mapping(uint => mapping(uint => uint)) public votesPerEpoch;
    mapping(uint => mapping(uint => bool)) public votedThisEpoch;
    mapping(uint => uint) public lastDripEpoch;
    uint public lastActionTimestamp;
    uint public playersCount;
    uint public numTanksAlive;
    uint public prizePool;
    GameState public state;
    uint public epochStart;
    uint[3] public podium;

    struct Tank {
        address owner;
        uint hearts;
        uint aps;
        uint range;
    }

    enum GameState {
        WaitingForPlayers,
        Started,
        Ended
    }

    // logs
    event GameStarted();
    event PlayerJoined(address player);
    event Move(uint tankId, uint x, uint y);
    event Shoot(uint tankId, uint targetId);
    event Give(uint fromId, uint toId, uint hearts, uint aps);
    event Upgrade(uint tankId, uint range);
    event Vote(uint voter, uint cursed, uint epoch);
    event Drip(uint tankId, uint amount);
    event Claim(address reciever, uint tankId, uint amount);

    ITankGame.GameSettings private _settings;

    constructor(ITankGame.GameSettings memory gs) payable {
        _settings = gs;
        // not sure if this will end up being necissary
        state = GameState.WaitingForPlayers;
        prizePool = msg.value;
    }

    function settings() external view returns (GameSettings memory) {
        return _settings;
    }

    function init() external payable {
        // TODO: Some sort of game initialization if necissary
        // state = GameState.WaitingForPlayers;
        // prizePool = msg.value;
    }

    // should do some sort of commit reveal thing for the randomness instead of this
    // random point thing
    function join() external payable {
        if (players[msg.sender] != 0) {
            revert("already joined");
        }
        if (playersCount >= this.settings().playerCount) {
            revert("game is full");
        }

        // this pattern sucks
        uint tries = 0;
        uint x;
        uint y;
        do {
            (x, y) = _randomPoint(tries);
            tries++;
        } while (tanksOnBoard[_pointToIndex(x, y)] != 0);
        Tank memory tank = Tank(
            msg.sender,
            this.settings().initHearts,
            this.settings().initAPs,
            this.settings().initShootRange
        );

        playersCount++;
        numTanksAlive++;
        uint position = _pointToIndex(x, y);
        tanksOnBoard[position] = playersCount;
        tanks[playersCount] = tank;
        tankToPosition[playersCount] = Point(x, y);
        players[msg.sender] = playersCount;
        if (playersCount >= this.settings().playerCount) {
            epochStart = _getEpoch();
            state = GameState.Started;
            emit GameStarted();
        }
        emit PlayerJoined(msg.sender);
    }

    modifier gameStarted() {
        require(state == GameState.Started, "game not started");
        _;
    }

    modifier isTankOwner(uint tankId) {
        require(tanks[tankId].owner == msg.sender, "not tank owner");
        _;
    }

    modifier isTankAlive(uint tankId) {
        require(tanks[tankId].hearts > 0, "tank is dead");
        _;
    }

    modifier isTankDead(uint tankId) {
        require(tanks[tankId].hearts == 0, "tank is alive");
        _;
    }

    function move(
        uint tankId,
        Point calldata to
    ) external gameStarted isTankOwner(tankId) isTankAlive(tankId) {
        if (
            to.x >= this.settings().boardSize ||
            to.y >= this.settings().boardSize
        ) {
            revert("out of bounds");
        }
        if (tanksOnBoard[_pointToIndex(to.x, to.y)] != 0) {
            revert("position occupied");
        }

        Point memory p = tankToPosition[tankId];
        uint apsRequired = _getDistance(p, to);
        if (apsRequired > tanks[tankId].aps) {
            revert("not enough action points");
        }

        tanks[tankId].aps -= apsRequired;
        tankToPosition[tankId] = to;
        tanksOnBoard[_pointToIndex(to.x, to.y)] = tankId;
        tanksOnBoard[_pointToIndex(p.x, p.y)] = 0; // clear old position
        lastActionTimestamp = block.timestamp;
        emit Move(tankId, to.x, to.y);
    }

    function shoot(
        uint fromId,
        uint toId
    )
        external
        gameStarted
        isTankOwner(fromId)
        isTankAlive(fromId)
        isTankAlive(toId)
    {
        Point memory from = tankToPosition[fromId];
        Point memory to = tankToPosition[toId];

        uint distance = _getDistance(from, to);
        if (distance > tanks[fromId].range) {
            revert("target out of range");
        }
        if (tanks[fromId].aps < 1) {
            revert("not enough action points");
        }

        tanks[fromId].aps -= 1;
        tanks[toId].hearts -= 1;
        if (tanks[toId].hearts == 0) {
            numTanksAlive--;
            if (numTanksAlive <= 2) {
                podium[numTanksAlive] = toId;
                if (numTanksAlive == 1) {
                    podium[0] = fromId; // winner
                    state = GameState.Ended;
                }
            }
        }

        lastActionTimestamp = block.timestamp;
        emit Shoot(fromId, toId);
    }

    function give(
        uint fromId,
        uint toId,
        uint hearts,
        uint aps
    ) external gameStarted isTankOwner(fromId) isTankAlive(fromId) {
        if (hearts > tanks[fromId].hearts) {
            revert("not enough hearts");
        }
        if (aps > tanks[fromId].aps) {
            revert("not enough action points");
        }
        uint distance = _getDistance(
            tankToPosition[fromId],
            tankToPosition[toId]
        );
        if (distance > tanks[fromId].range) {
            revert("target out of range");
        }

        tanks[fromId].hearts -= hearts;
        tanks[fromId].aps -= aps;
        tanks[toId].hearts += hearts;
        tanks[toId].aps += aps;

        lastActionTimestamp = block.timestamp;
        emit Give(fromId, toId, hearts, aps);
    }

    function upgrade(
        uint tankId
    ) external gameStarted isTankOwner(tankId) isTankAlive(tankId) {
        if (tanks[tankId].aps < this.settings().upgradeCost) {
            revert("not enough action points");
        }
        tanks[tankId].aps -= this.settings().upgradeCost;
        tanks[tankId].range += 1;
        lastActionTimestamp = block.timestamp;
        emit Upgrade(tankId, tanks[tankId].range);
    }

    function vote(
        uint voter,
        uint cursed
    ) external gameStarted isTankDead(voter) {
        uint epoch = _getEpoch();
        if (votesPerEpoch[epoch][voter] != 0) {
            revert("already voted");
        }

        votesPerEpoch[epoch][cursed] += 1;
        votedThisEpoch[epoch][voter] = true;

        lastActionTimestamp = block.timestamp;
        emit Vote(voter, cursed, epoch);
    }

    function drip(uint tankId) external gameStarted {
        uint epoch = (block.timestamp - epochStart) /
            this.settings().epochSeconds;
        if (epoch == epochStart) {
            revert("too early to drip");
        }
        uint lastDrippedEpoch = lastDripEpoch[tankId];
        if (epoch == lastDrippedEpoch) {
            revert("already dripped");
        }

        lastDrippedEpoch = lastDrippedEpoch > 0 ? lastDrippedEpoch : epochStart;
        uint amount = epoch - lastDrippedEpoch;
        tanks[tankId].aps += amount;

        lastDripEpoch[tankId] = epoch;
        lastActionTimestamp = block.timestamp;
        emit Drip(tankId, amount);
    }

    function claim(uint tankId, address claimer) external isTankOwner(tankId) {
        if (state != GameState.Ended) {
            revert("game not ended");
        }
        // loop is a bit gross, could do a mapping of tank to position on podium
        for (uint i = 0; i < podium.length; i++) {
            if (podium[i] == tankId) {
                // payout structure is 60% 30% 10%. would be nice if there was a sequence
                podium[i] = 0; // clear podium for reentrency
                uint p = i == 0 ? 60 : i == 1 ? 30 : 10;
                uint place_prize = (prizePool * p) / 100;
                payable(claimer).transfer(place_prize);
                emit Claim(claimer, tankId, place_prize);
                return;
            }
        }
        revert("tank not on podium");
    }

    /// helpers ///
    function _getEpoch() internal view returns (uint) {
        return (block.timestamp - epochStart) / this.settings().epochSeconds;
    }

    function _randomPoint(uint salt) internal view returns (uint x, uint y) {
        // TODO: use randao to make this more reliable randomness
        uint seed = uint(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    playersCount,
                    salt
                )
            )
        );
        x = seed % this.settings().boardSize;
        y = (seed / this.settings().boardSize) % this.settings().boardSize;
        return (x, y);
    }

    function pointToIndex(Point memory p) external view returns (uint) {
        return _pointToIndex(p.x, p.y);
    }

    function _pointToIndex(uint x, uint y) internal view returns (uint) {
        return x + y * this.settings().boardSize;
    }

    function getDistance(uint tankA, uint tankB) external view returns (uint) {
        return _getDistance(tankToPosition[tankA], tankToPosition[tankB]);
    }

    function getDistance(
        uint tankA,
        Point memory p
    ) external view returns (uint) {
        Point memory b = tankToPosition[tankA];
        return _getDistance(b.x, b.y, p.x, p.y);
    }

    function _getDistance(
        Point memory a,
        Point memory b
    ) internal pure returns (uint) {
        return _getDistance(a.x, a.y, b.x, b.y);
    }

    function _getDistance(
        uint ax,
        uint ay,
        uint bx,
        uint by
    ) internal pure returns (uint) {
        uint x = ax > bx ? ax - bx : bx - ax;
        uint y = ay > by ? ay - by : by - ay;
        return x > y ? x : y;
    }

    /// readonly stuff used for frontend, move this to a view contract ///
    struct TankLocation {
        Tank tank;
        Point position;
        uint tankId;
    }

    function getAllTanks() external view returns (TankLocation[] memory) {
        TankLocation[] memory tanksWithLocation = new TankLocation[](
            playersCount
        );
        for (uint i = 1; i <= playersCount; i++) {
            Point memory position = tankToPosition[i];
            Tank memory tank = tanks[i];
            tanksWithLocation[i-1] = TankLocation(tank, position, i);
        }
        return tanksWithLocation;
    }
}
