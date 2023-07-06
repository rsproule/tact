// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Test } from "forge-std/Test.sol";
import { TankGameFactory } from "src/base/TankGameFactory.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";

contract TankGameFactoryTest is Test {
    TankGameFactory public factory;

    function setUp() public {
        factory = new TankGameFactory();
    }

    function test_createGame() public {
        ITankGame.GameSettings memory gs = ITankGame.GameSettings({
            playerCount: 8,
            boardSize: 10,
            initAPs: 3,
            initHearts: 3,
            initShootRange: 3,
            upgradeCost: 3,
            epochSeconds: 4 hours,
            voteThreshold: 3,
            actionDelaySeconds: 0,
            buyInMinimum: 0,
            revealWaitBlocks: 10,
            spawnerCooldown: 10
        });
        address gameAddress = factory.createGame(gs);
    }
}
