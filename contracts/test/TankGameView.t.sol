// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./TankGame.t.sol";
import "../src/view/TankGameView.sol";

contract ViewTest is TankTest {
    function testView() public {
        super.initGame();
        TankGameView viewGame = new TankGameView(tankGame);
        TankGameView.TankLocation[] memory fullBoard = viewGame.getAllTanks();
        // assert the values on the board
        for (uint160 i = 0; i < fullBoard.length; i++) {
            TankGameView.TankLocation memory tl = fullBoard[i];
            // TODO need to actually check the contents here.
            // there needs to be some way to deterministically
            // initialize the contents of the board, this would
            // be useful for the other tests too
            uint256 tid = tankGame.players(address(i + 1));
            assertEq(tid, tl.tankId, "unexepected tank id");
        }
    }
}
