// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Board } from "src/interfaces/IBoard.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";

contract GameView {
    ITankGame public game;

    constructor(ITankGame _game) {
        game = _game;
    }

    struct TankLocation {
        ITankGame.Tank tank;
        Board.Point position;
        uint256 tankId;
    }

    struct HeartLocation {
        Board.Point position;
        uint256 numHearts;
    }

    function getAllTanks() external view returns (TankLocation[] memory) {
        TankLocation[] memory tanksWithLocation = new TankLocation[](
            game.getPlayerCount()
        );
        for (uint256 i = 1; i <= game.getPlayerCount(); i++) {
            Board.Point memory position = game.getBoard().getTankPosition(i);
            ITankGame.Tank memory tank = game.getTank(i);
            tanksWithLocation[i - 1] = TankLocation(tank, position, i);
        }
        return tanksWithLocation;
    }

    // return the list of heart positions.
    function getAllHearts() external view returns (HeartLocation[] memory) {
        // iterate the whole board, better to do this here instead of in the frontend
        // 1 call instead of N calls
        uint256 tilesWithHearts = 0;
        uint256 boardSize = game.getSettings().boardSize;
        HeartLocation[] memory hearts = new HeartLocation[](boardSize * boardSize);
        for (uint256 q = 0; q <= 2 * boardSize + 1; q++) {
            // TODO: a bit gnarlly that we are duplicating this code here.
            uint256 minR = q <= boardSize ? boardSize - q : 0;
            uint256 maxR = 3 * boardSize - q;
            for (uint256 r = minR; r < maxR; r++) {
                uint256 s = 3 * boardSize - q - r;
                uint256 numHearts = game.getBoard().getHeartAtPosition(Board.Point(q, r, s));
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
}
