// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Board } from "src/interfaces/IBoard.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { TankGame } from "src/base/TankGameV2.sol";
import { IGameView } from "src/view/IGameView.sol";

contract GameView is IGameView {
    function getAllTanks(address game) external view override returns (TankLocation[] memory) {
        TankLocation[] memory tanksWithLocation = new TankLocation[](getPlayerCount(game));
        for (uint256 i = 1; i <= getPlayerCount(game); i++) {
            Board.Point memory position = getBoard(game).getTankPosition(i);
            ITankGame.Tank memory tank = getTank(game, i);
            tanksWithLocation[i - 1] = TankLocation(tank, position, i);
        }
        return tanksWithLocation;
    }

    // return the list of heart positions.
    function getAllHearts(address game) external view override returns (HeartLocation[] memory) {
        // iterate the whole board, better to do this here instead of in the frontend
        // 1 call instead of N calls
        uint256 tilesWithHearts = 0;
        uint256 boardSize = getSettings(game).boardSize;
        HeartLocation[] memory hearts = new HeartLocation[](boardSize * boardSize);
        for (uint256 q = 0; q <= 2 * boardSize + 1; q++) {
            // TODO: a bit gnarlly that we are duplicating this code here.
            uint256 minR = q <= boardSize ? boardSize - q : 0;
            uint256 maxR = 3 * boardSize - q;
            for (uint256 r = minR; r < maxR; r++) {
                uint256 s = 3 * boardSize - q - r;
                uint256 numHearts = getBoard(game).getHeartAtPosition(Board.Point(q, r, s));
                if (numHearts > 0) {
                    HeartLocation memory hl = HeartLocation(Board.Point(q, r, s), numHearts);
                    hearts[tilesWithHearts] = hl;
                    tilesWithHearts += 1;
                }
            }
        }

        // convert the storage array into memory array, cuz fuck solidity
        HeartLocation[] memory hls = new HeartLocation[](tilesWithHearts);
        for (uint256 i = 0; i < tilesWithHearts; i++) {
            hls[i] = hearts[i];
        }

        return hls;
    }

    function isAuth(address game, uint256 tankId, address _owner) public view override returns (bool) {
        TankGame tankGame = TankGame(game);
        return getTank(game, tankId).owner == _owner || tankGame.delegates(tankId, _owner);
    }

    function getState(address game) public view override returns (ITankGame.GameState) {
        TankGame game = TankGame(game);
        return game.state();
    }

    function getEpoch(address game) public view override returns (uint256) {
        TankGame game = TankGame(game);
        return game._getEpoch();
    }

    function getGameEpoch(address game) public view override returns (uint256) {
        TankGame tankGame = TankGame(game);
        if (getState(game) == ITankGame.GameState.WaitingForPlayers) {
            return 0; // this is cuz epoch start would be 0
        }
        return tankGame._getEpoch() - tankGame.epochStart();
    }

    function getTank(address game, uint256 tankId) public view returns (ITankGame.Tank memory) {
        TankGame game = TankGame(game);
        (address owner, uint256 hearts, uint256 aps, uint256 range) = game.tanks(tankId);
        return ITankGame.Tank({ owner: owner, hearts: hearts, aps: aps, range: range });
    }

    function getPlayerCount(address game) public view returns (uint256) {
        TankGame game = TankGame(game);
        return game.playersCount();
    }

    function getBoard(address game) public view returns (Board) {
        TankGame game = TankGame(game);
        return game.board();
    }

    function getSettings(address game) public view returns (ITankGame.GameSettings memory) {
        TankGame game = TankGame(game);
        (
            uint256 playerCount,
            uint256 boardSize,
            uint256 initAPs,
            uint256 initHearts,
            uint256 initShootRange,
            uint256 epochSeconds,
            uint256 buyInMinimum,
            uint256 revealWaitBlocks,
            bool autoStart,
            bytes32 root
        ) = game.settings();
        return ITankGame.GameSettings({
            playerCount: playerCount,
            boardSize: boardSize,
            initAPs: initAPs,
            initHearts: initHearts,
            initShootRange: initShootRange,
            epochSeconds: epochSeconds,
            buyInMinimum: buyInMinimum,
            revealWaitBlocks: revealWaitBlocks,
            autoStart: autoStart,
            root: root
        });
    }

    function _getLastDrip(address game, uint256 tankId) internal view returns (uint256) {
        TankGame game = TankGame(game);
        uint256 lastDrippedEpoch = game.lastDripEpoch(tankId);
        return lastDrippedEpoch = lastDrippedEpoch > 0 ? lastDrippedEpoch : game.epochStart();
    }

    function getLastDrip(address game, uint256 tankId) public view returns (uint256) {
        return _getLastDrip(game, tankId);
    }

    function getUpgradeCost(address game, uint256 tankId) public view returns (uint256) {
        // 12, 18, 24, 30, 36, 42, 48, 54, 60
        return getBoard(game).getPerimeterForRadius(getTank(game, tankId).range) - 6;
    }
}
