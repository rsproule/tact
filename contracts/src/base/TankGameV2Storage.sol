// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ITankGame } from "src/interfaces/ITankGame.sol";
import { Board } from "src/interfaces/IBoard.sol";
import { IHooks } from "src/interfaces/IHooks.sol";

contract TankGameV2Storage {
    mapping(address player => uint256 tank) public players;
    mapping(uint256 tankId => ITankGame.Tank tank) public tanks;
    mapping(uint256 tankId => uint256 epoch) public lastDripEpoch;
    mapping(uint256 tankId => mapping(address delegate => bool isDelegate)) public delegates;
    mapping(uint256 epoch => mapping(uint256 tankId => uint256 votes)) public votesPerEpoch;
    mapping(uint256 epoch => bool votingClosed) public votingClosed;
    mapping(uint256 epoch => mapping(uint256 tankId => bool voted)) public votedThisEpoch;
    mapping(uint256 tankId => bool claimed) public claimed;
    mapping(uint256 tankId => IHooks[] hooks) public tankHooks;
    uint256 public playersCount;
    uint256 public numTanksAlive;
    uint256 public prizePool;
    uint256 public epochStart;
    uint256[3] public podium;
    uint256[] public deadTanks;
    uint256 public aliveTanksIdSum;
    uint256 public revealBlock;
    uint256 public lastRevealBlock;
    address public owner;
    ITankGame.GameState public state; // can calculate this
    ITankGame.GameSettings public settings;
    ITankGame.StateData public stateData;
    Board public board;
}
