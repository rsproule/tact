// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Test } from "forge-std/Test.sol";
// import { TankGameFactory } from "src/base/TankGameFactory.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { TankGame } from "src/base/TankGameV2.sol";
import { GameView } from "src/view/GameView.sol";

contract TankGameFactoryTest is Test {
    GameView public gameView;
    TankGame public game;

    function setUp() public {
        game = new TankGame();
        game.initialize(getSettings(), msg.sender);
        bytes32[] memory proof = new bytes32[](1);
        vm.prank(address(1));
        game.join(ITankGame.JoinParams(address(1), proof, "player1"));
        vm.prank(address(3));
        game.join(ITankGame.JoinParams(address(3), proof, "player1"));
        game.start();
        gameView = new GameView();
    }

    function test_view_getAllTanks() public {
        GameView.TankLocation[] memory tanks = gameView.getAllTanks(address(game));
        assertTrue(tanks.length == 2, "tanks length is 1");
    }

    function test_view_getAllHearts() public {
        GameView.HeartLocation[] memory hearts = gameView.getAllHearts(address(game));
        assertTrue(hearts.length == 0, "tanks length is 0");
        vm.roll(2);
        game.reveal();
        hearts = gameView.getAllHearts(address(game));
        assertTrue(hearts.length == 1, "tanks length is 1");
    }

    function getSettings() internal pure returns (ITankGame.GameSettings memory) {
        return ITankGame.GameSettings({
            playerCount: 2,
            boardSize: 12,
            initAPs: 3,
            initHearts: 3,
            initShootRange: 3,
            epochSeconds: 4 hours,
            buyInMinimum: 0,
            revealWaitBlocks: 1,
            autoStart: false,
            root: bytes32(0)
        });
    }
}
