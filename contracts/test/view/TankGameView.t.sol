// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Test } from "forge-std/Test.sol";
import { TankGameFactory } from "src/base/TankGameFactory.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { TankGame } from "src/base/TankGameV2.sol";
import { GameView } from "src/view/GameView.sol";

contract TankGameFactoryTest is Test {
    TankGameFactory public factory;
    GameView public gameView;

    function setUp() public {
        factory = new TankGameFactory();
        TankGame game = factory.createGame(getSettings());
        bytes32[] memory proof = new bytes32[](1);
        vm.prank(address(1));
        game.join(proof);
        gameView = new GameView(game);
    }

    function test_view_getAllTanks() public {
        GameView.TankLocation[] memory tanks = gameView.getAllTanks();
        assertTrue(tanks.length == 1, "tanks length is 1");
    }

    function getSettings() internal pure returns (ITankGame.GameSettings memory) {
        return ITankGame.GameSettings({
            playerCount: 1,
            boardSize: 12,
            initAPs: 3,
            initHearts: 3,
            initShootRange: 3,
            epochSeconds: 4 hours,
            buyInMinimum: 0,
            revealWaitBlocks: 1000,
            root: bytes32(0)
        });
    }
}
