// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ITankGame.sol";

contract TankGame is ITankGame {
    mapping(address => uint) public players;
    mapping(uint => Tank) public tanks;
    mapping(uint => Point) public positions;
    mapping(uint => uint) public heartsOnBoard;
    // mapping(uint => uint) public actionPointsOnBoard;
    mapping(uint => mapping(uint => uint)) public votesPerEpoch;
    mapping(uint => mapping(uint => bool)) public votedThisEpoch;
    mapping(uint => uint) public lastDripEpoch;
    uint public lastActionTimestamp;
    uint public playersCount;
    uint public prizePool;
    GameState public state;
    uint public epochStart;

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

    ITankGame.GameSettings public _settings;

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

    function join() external {
        if (players[msg.sender] != 0) {
            revert("already joined");
        }
        if (playersCount >= this.settings().playerCount) {
            revert("game is full");
        }

        // this should make sure not to collide
        (uint x, uint y) = _randomPoint();
        Tank memory tank = Tank(
            msg.sender,
            this.settings().initHearts,
            this.settings().initAPs,
            this.settings().initShootRange
        );

        uint tankId = pointToIndex(x, y);
        tanks[tankId] = tank;
        players[msg.sender] = tankId;
        playersCount++;
        if (playersCount == this.settings().playerCount) {
            epochStart = block.timestamp;
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
        Point memory p = positions[tankId];
        uint apsRequired = getDistance(p, to);
        if (apsRequired > tanks[tankId].aps) {
            revert("not enough action points");
        }

        tanks[tankId].aps -= apsRequired;
        positions[tankId] = to;
        lastActionTimestamp = block.timestamp;
        emit Move(tankId, to.x, to.y);
    }

    function shoot(
        uint fromId,
        uint toId
    ) external gameStarted isTankOwner(fromId) isTankAlive(fromId) {
        Point memory from = positions[fromId];
        Point memory to = positions[toId];

        uint distance = getDistance(from, to);
        if (distance > tanks[fromId].range) {
            revert("target out of range");
        }
        if (distance > tanks[fromId].aps) {
            revert("not enough action points");
        }
        if (tanks[toId].hearts == 0) {
            revert("target is already dead");
        }

        tanks[fromId].aps -= distance;
        tanks[toId].hearts -= 1;

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
        uint distance = getDistance(positions[fromId], positions[toId]);
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
        uint epoch = (block.timestamp - epochStart) /
            this.settings().epochSeconds;
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
        uint lastDrippedEpoch = lastDripEpoch[tankId];
        if (epoch == lastDrippedEpoch) {
            revert("already dripped");
        }

        uint amount = lastDrippedEpoch - epoch;
        tanks[tankId].aps += amount;

        lastDripEpoch[tankId] = epoch;
        lastActionTimestamp = block.timestamp;
        emit Drip(tankId, amount);
    }

    function claim() external {
        if (state != GameState.Ended) {
            revert("game not ended");
        }

        if (tanks[players[msg.sender]].hearts <= 0) {
            revert("not a winner");
        }

        // need to calculate if you are first second or third somehow
        uint prize = address(this).balance;

        payable(msg.sender).transfer(prize);
    }

    /// helpers ///

    function _randomPoint() internal view returns (uint x, uint y) {
        // TODO: use randao to make this more reliable randomness
        uint seed = uint(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)
            )
        );
        x = seed % this.settings().boardSize;
        y = (seed / this.settings().boardSize) % this.settings().boardSize;
        return (x, y);
    }

    function pointToIndex(uint x, uint y) internal view returns (uint) {
        return x + y * this.settings().boardSize;
    }

    function getDistance(
        Point memory a,
        Point memory b
    ) internal pure returns (uint) {
        uint x = a.x > b.x ? a.x - b.x : b.x - a.x;
        uint y = a.y > b.y ? a.y - b.y : b.y - a.y;
        return x > y ? x : y;
    }
}
