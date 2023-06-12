// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../src/TankGame.sol";
import "../src/ITankGame.sol";

contract CounterTest is Test {
    TankGame public tankGame;

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

    function initGame() public {
        for (uint160 i = 1; i < 9; i++) {
            vm.prank(address(i));
            tankGame.join();
        }
    }

    function testJoinGame() public {
        tankGame.join();
        assertEq(tankGame.playersCount(), 1);
    }

    function testJoinGameTwiceFails() public {
        tankGame.join();
        assertEq(tankGame.playersCount(), 1);
        vm.expectRevert("already joined");
        tankGame.join();
    }

    function testJoinFullGame() public {
        for (uint160 i = 0; i < 8; i++) {
            vm.prank(address(i));
            tankGame.join();
        }
        vm.expectRevert("game is full");
        tankGame.join();
    }

    function testInitGame() public {
        initGame();
        assert(tankGame.state() == TankGame.GameState.Started);
        assertEq(tankGame.playersCount(), 8);
    }

    ///// tests for move() ///// 

    function testMove() public {
        initGame();
        (uint x, uint y) = tankGame.tankToPosition(1);
        (, , uint apsBefore, ) = tankGame.tanks(1);
        if (
            tankGame.tanksOnBoard(
                tankGame.pointToIndex(ITankGame.Point(x + 1, y))
            ) != 0
        ) {
            console.log(
                "this position is occupied, this is cuz randomness sucks"
            );
        }
        vm.prank(address(1));
        tankGame.move(1, ITankGame.Point(x + 1, y));
        (, , uint apsAfter, ) = tankGame.tanks(1);
        (uint xd, uint yd) = tankGame.tankToPosition(1);
        assertEq(xd, x + 1);
        assertEq(yd, y);
        // assert the tank is in the new position
        assertEq(
            tankGame.tanksOnBoard(
                tankGame.pointToIndex(ITankGame.Point(x + 1, y))
            ),
            1
        );
        // assert the old position is now empty
        assertEq(
            tankGame.tanksOnBoard(tankGame.pointToIndex(ITankGame.Point(x, y))),
            0
        );
        // assert that an action point was spent
        assertEq(apsBefore - apsAfter, 1);
    }

    function testMoveOutOfBounds() public {
        initGame();
        uint boardSize = tankGame.settings().boardSize;
        vm.prank(address(1));
        vm.expectRevert("out of bounds");
        tankGame.move(1, ITankGame.Point(boardSize + 1, boardSize + 1));
    }

    function testMoveTooFar() public {
        initGame();
        (uint x, uint y) = tankGame.tankToPosition(1);
        (, , uint apsBefore, ) = tankGame.tanks(1);
        vm.prank(address(1));
        vm.expectRevert("not enough action points");
        tankGame.move(1, ITankGame.Point(x + apsBefore + 1, y));
    }

    function testMoveNowhere() public {
        initGame();
        (uint x, uint y) = tankGame.tankToPosition(1);
        vm.prank(address(1));
        vm.expectRevert("position occupied");
        tankGame.move(1, ITankGame.Point(x, y));
    }

    function testMoveToOccupied() public {
        initGame();
        // check if any are in range to collide. if not do multiple move to make this happen
        for (uint160 i = 1; i < 9; i++) {
            for (uint160 j = 1; j < 9; j++) {
                if (i == j) {
                    continue;
                }
                uint distance = tankGame.getDistance(i, j);
                if (distance < 3) {
                    (uint x, uint y) = tankGame.tankToPosition(i);
                    vm.prank(address(j));
                    vm.expectRevert("position occupied");
                    tankGame.move(j, ITankGame.Point(x, y));
                }
            }
        }
    }


    ///// TESTs for shoot ///// 
    function testShoot() public {
        initGame(); 
        // check if any are in range to collide. if not do multiple move to make this happen
        for (uint160 i = 1; i < 9; i++) {
            for (uint160 j = 1; j < 9; j++) {
                if (i == j) {
                    continue;
                }
                uint distance = tankGame.getDistance(i, j);
                if (distance < 3) {
                    vm.prank(address(i));
                    tankGame.shoot(i, j);
                    (, uint hearts, , ) = tankGame.tanks(j);
                    assertEq(hearts, 2);
                    (, , uint aps, ) = tankGame.tanks(i);
                    assertEq(aps, 2);
                    return;
                }
            }
        }
    }
}
