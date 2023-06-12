// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/TankGame.sol";
import "../src/ITankGame.sol";

contract CounterTest is Test {
    ITankGame public tankGame;

    function setUp() public {
        ITankGame.GameSettings memory gs = ITankGame.GameSettings({
            playerCount: 8,
            boardSize: 10,
            initAPs: 3,
            initHearts: 3,
            initShootRange: 3,
            upgradeCost: 3,
            epochSeconds: 24 hours, 
            voteThreshold: 3,
            actionDelaySeconds: 0

        });
        tankGame = new TankGame(gs);
    }
}
