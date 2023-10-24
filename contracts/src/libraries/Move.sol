// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ITankGame } from "src/interfaces/ITankGame.sol";
import { Board } from "src/interfaces/IBoard.sol";

library MoveLib {
    function verifyMove(
        ITankGame.MoveParams memory params,
        Board board,
        mapping(uint256 tankId => ITankGame.Tank tank) storage tanks,
        Board.Tile memory tile,
        uint256 apsRequired
    )
        external
        view
    {
        uint256 tankId = params.tankId;
        Board.Point memory to = params.to;
        require(board.isValidPoint(to), "invalid point");
        require(tile.tankId == 0, "position occupied");
        require(apsRequired <= tanks[tankId].aps, "not enough action points");
    }

    function doMove(
        ITankGame.MoveParams memory params,
        Board board,
        mapping(uint256 tankId => ITankGame.Tank tank) storage tanks,
        Board.Tile memory tile,
        uint256 apsRequired
    )
        external
    {
        uint256 tankId = params.tankId;
        Board.Point memory to = params.to;
        tanks[tankId].hearts += tile.hearts;
        tanks[tankId].aps -= apsRequired;
        Board.Point memory from = board.getTankPosition(tankId);
        board.setTile(to, Board.Tile({ tankId: tankId, hearts: 0 }));
        board.setTile(from, Board.Tile({ tankId: 0, hearts: 0 }));
    }
}
