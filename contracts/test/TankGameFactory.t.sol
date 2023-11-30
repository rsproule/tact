// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Test } from "forge-std/Test.sol";
import { TankGameFactory } from "src/base/TankGameFactory.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { TankGame } from "src/base/TankGameV2.sol";
import { HookFactory } from "src/base/HookFactory.sol";
import { GameView } from "src/view/GameView.sol";

contract TankGameFactoryTest is Test {
  TankGameFactory public factory;
  TankGame gameImpl;

  function setUp() public {
    GameView gameView = new GameView();
    HookFactory hookFactory = new HookFactory();
    factory = new TankGameFactory(gameView, hookFactory);
    gameImpl = new TankGame();
  }

  function test_factory_createGame() public {
    ITankGame.GameSettings memory gs = ITankGame.GameSettings({
      playerCount: 8,
      boardSize: 12,
      initAPs: 3,
      initHearts: 3,
      initShootRange: 3,
      epochSeconds: 4 hours,
      buyInMinimum: 0,
      revealWaitBlocks: 1000,
      autoStart: false,
      root: bytes32(0)
    });
    ITankGame gameAddress = factory.createGame(address(gameImpl), gs, msg.sender);
    assertTrue(address(gameAddress) != address(0), "game address not zero");
  }

  function test_invalidBoardSize() public {
    ITankGame.GameSettings memory gs = ITankGame.GameSettings({
      playerCount: 8,
      boardSize: 10,
      initAPs: 3,
      initHearts: 3,
      initShootRange: 3,
      epochSeconds: 4 hours,
      buyInMinimum: 0,
      revealWaitBlocks: 1000,
      autoStart: false,
      root: bytes32(0)
    });
    vm.expectRevert("invalid board size");
    factory.createGame(address(gameImpl), gs, msg.sender);
  }
}
