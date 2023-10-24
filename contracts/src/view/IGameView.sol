// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Board } from "src/interfaces/IBoard.sol";
import { IHooks } from "src/interfaces/IHooks.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";

interface IGameView {
    struct TankLocation {
        ITankGame.Tank tank;
        Board.Point position;
        uint256 tankId;
    }

    struct HeartLocation {
        Board.Point position;
        uint256 numHearts;
    }

    function getPlayerCount(address game) external view returns (uint256);

    function getTank(address game, uint256 tankId) external view returns (ITankGame.Tank memory);

    function getBoard(address game) external view returns (Board);

    function getSettings(address game) external view returns (ITankGame.GameSettings memory);

    function getLastDrip(address game, uint256 tankId) external view returns (uint256);

    function isAuth(address game, uint256 tankId, address owner) external view returns (bool);

    function getState(address game) external view returns (ITankGame.GameState);

    function getEpoch(address game) external view returns (uint256);

    function getGameEpoch(address game) external view returns (uint256);

    function getAllHearts(address game) external view returns (HeartLocation[] memory);

    function getAllTanks(address game) external view returns (TankLocation[] memory);
}
