// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Board } from "src/interfaces/IBoard.sol";

interface ITankGame {
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
        uint256 buyInMinimum;
        uint256 revealWaitBlocks;
        uint256 spawnerCooldown;
    }

    function join() external payable;

    function move(uint256 fromId, Board.Point calldata to) external;

    function shoot(uint256 fromId, uint256 toId, uint256 shots) external;

    function give(uint256 fromId, uint256 toId, uint256 hearts, uint256 aps) external;

    function upgrade(uint256 tankId) external;

    function vote(uint256 voter, uint256 cursed) external;

    function claim(uint256 tankId, address claimer) external;

    function delegate(uint256 tankId, address delegatee) external;

    function commit() external;

    function reveal() external;
}
