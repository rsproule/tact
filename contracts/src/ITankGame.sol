// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ITankGame {
    struct Point {
        uint x;
        uint y;
    }

    struct GameSettings {
        uint playerCount;
        uint boardSize;
        uint initAPs;
        uint initHearts;
        uint voteThreshold;
        uint initShootRange;
        uint upgradeCost;
        uint epochSeconds;
        uint actionDelaySeconds;
    }

    enum Resource {
        ActionPoint,
        Heart
    }

    function init() external payable;

    function join() external payable;

    function move(uint fromId, Point calldata to) external;

    function shoot(uint fromId, uint toId) external;

    function give(
        uint fromId,
        uint toId,
        uint hearts,
        uint aps
    ) external;

    function drip(uint tankId) external;

    function upgrade(uint tankId) external;

    // dead man actions
    function vote(uint voter, uint cursed) external;

    function claim(uint tankId, address claimer) external;

    // game settings
    function settings() external view returns (GameSettings memory);
}
