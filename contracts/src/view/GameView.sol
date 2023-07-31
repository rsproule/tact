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
}
