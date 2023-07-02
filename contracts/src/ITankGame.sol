// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ITankGame {
    struct Point {
        uint256 x;
        uint256 y;
    }

    struct GameSettings {
        uint256 playerCount;
        uint256 boardSize;
        uint256 initAPs;
        uint256 initHearts;
        uint256 voteThreshold;
        uint256 initShootRange;
        uint256 upgradeCost;
        uint256 epochSeconds;
        uint256 actionDelaySeconds;
    }

    enum Resource {
        ActionPoint,
        Heart
    }

    function join() external payable;

    function move(uint256 fromId, Point calldata to) external;

    function shoot(uint256 fromId, uint256 toId) external;

    function give(
        uint256 fromId,
        uint256 toId,
        uint256 hearts,
        uint256 aps
    ) external;

    function drip(uint256 tankId) external;

    function upgrade(uint256 tankId) external;

    // dead man actions
    function vote(uint256 voter, uint256 cursed) external;

    function claim(uint256 tankId, address claimer) external;

    // game settings
    function settings() external view returns (GameSettings memory);
}
