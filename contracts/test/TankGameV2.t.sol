// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import { Vm } from "forge-std/Vm.sol";
import { TankGame } from "src/base/TankGameV2.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { Board } from "src/interfaces/IBoard.sol";
import { HexBoard } from "src/base/HexBoard.sol";

contract TankTest is Test {
    TankGame public tankGame;

    function setUp() public {
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
        tankGame = new TankGame{value: 10 ether}(gs);
    }

    function initGame(uint160 offset) public {
        for (uint160 i = 1; i < 9; i++) {
            vm.label(address(i + offset), string(abi.encodePacked("tank", Strings.toString(i))));
            vm.prank(address(i + offset));
            tankGame.join();
        }
        vm.clearMockedCalls();
    }

    function initGame() public {
        initGame(0);
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
        assert(tankGame.state() == ITankGame.GameState.Started);
        assertEq(tankGame.playersCount(), 8);
    }

    function testGetDistance() public {
        Board.Point memory p0 = Board.Point({ x: 3, y: 3, z: 3 });
        Board.Point memory p1 = Board.Point({ x: 4, y: 2, z: 3 });
        uint256 distance = tankGame.board().getDistance(p0, p1);
        assertEq(distance, 1, "distance should be 1");
        Board.Point memory p2 = Board.Point({ x: 5, y: 1, z: 3 });
        uint256 distance2 = tankGame.board().getDistance(p0, p2);
        assertEq(distance2, 2, "distance should be 2");
    }

    function testRandomPoints() public {
        for (uint256 i = 0; i < 10_000; i++) {
            uint256 seed = uint256(keccak256(abi.encodePacked(i)));
            Board.Point memory p0 = tankGame.board().randomPoint(seed);
            // console.log("random point: (%s, %s, %s)", p0.x, p0.y, p0.z);
            assertTrue(tankGame.board().isValidPoint(p0), "point should be valid");
        }
    }

    ///// tests for move() /////

    function testMoveNormal() public {
        initGame();
        Board.Point memory p0 = tankGame.board().getTankPosition(1);
        vm.mockCall(
            address(tankGame.getBoard()),
            abi.encodeWithSelector(HexBoard.getDistanceTankToPoint.selector),
            abi.encode(1)
        );
        uint256 apsBefore = tankGame.getTank(1).aps;
        vm.prank(address(1));
        tankGame.move(1, Board.Point(p0.x + 1, p0.y - 1, p0.z));
        uint256 apsAfter = tankGame.getTank(1).aps;
        Board.Point memory p = tankGame.board().getTankPosition(1);
        assertEq(p.x, p0.x + 1, "wrong x coord");
        assertEq(p.y, p0.y - 1, "wrong y coord");
        assertEq(p.z, p0.z, "wrong z coord");
        assertEq(tankGame.board().getTile(p0).tankId, 0, "old tile should be empty");
        // assert that an action point was spent
        assertEq(apsBefore - apsAfter, 1);
    }

    function testMoveOutOfBounds() public {
        initGame();
        Board.Point memory invalidPoint = Board.Point({ x: 0, y: 0, z: 0 });
        vm.prank(address(1));
        vm.expectRevert("invalid point");
        tankGame.move(1, invalidPoint);
    }

    function testMoveTooFar() public {
        initGame();
        Board.Point memory to = Board.Point({ x: 0, y: 0, z: tankGame.getBoard().boardSize() });
        vm.mockCall(
            address(tankGame.getBoard()),
            abi.encodeWithSelector(HexBoard.getDistanceTankToPoint.selector),
            abi.encode(4)
        );
        vm.prank(address(1));
        vm.expectRevert("not enough action points");
        tankGame.move(1, to);
    }

    function testMoveToOccupied() public {
        initGame();
        Board.Point memory p0 = tankGame.board().getTankPosition(1);
        vm.mockCall(
            address(tankGame.getBoard()),
            abi.encodeWithSelector(HexBoard.getTile.selector),
            abi.encode(Board.Tile({ tankId: 1, hearts: 0 }))
        );
        vm.prank(address(1));
        vm.expectRevert("position occupied");
        tankGame.move(1, p0);
    }

    ///// TESTs for shoot /////
    function testShootNormal() public {
        initGame();
        vm.mockCall(
            address(tankGame.getBoard()), abi.encodeWithSelector(HexBoard.getDistanceTanks.selector), abi.encode(1)
        );
        vm.prank(address(8));
        tankGame.shoot(8, 6, 1);
        uint256 apsAfter = tankGame.getTank(8).aps;
        uint256 hearts = tankGame.getTank(6).hearts;
        assertEq(apsAfter, 2);
        assertEq(hearts, 2);
    }

    function testShootOutOfRange() public {
        initGame();
        vm.mockCall(
            address(tankGame.getBoard()), abi.encodeWithSelector(HexBoard.getDistanceTanks.selector), abi.encode(4)
        );
        vm.prank(address(1));
        vm.expectRevert("target out of range");
        tankGame.shoot(1, 8, 1);
    }

    function testShootNotEnoughAP() public {
        initGame();
        vm.mockCall(
            address(tankGame.getBoard()), abi.encodeWithSelector(HexBoard.getDistanceTanks.selector), abi.encode(1)
        );
        vm.prank(address(3));
        vm.expectRevert("not enough action points");
        tankGame.shoot(3, 4, 4);
    }

    function testShootDeadTank() public {
        initGame();
        vm.prank(address(5));
        tankGame.shoot(5, 3, 3);
        vm.expectRevert("tank is dead");
        vm.prank(address(4));
        tankGame.shoot(4, 3, 1);
    }

    function testShootNonexistentTank() public {
        initGame();
        vm.prank(address(5));
        vm.expectRevert("tank is dead");
        tankGame.shoot(5, 0, 1);
    }

    /// give tests ///

    function testGiveHeart() public {
        initGame();
        vm.mockCall(
            address(tankGame.getBoard()), abi.encodeWithSelector(HexBoard.getDistanceTanks.selector), abi.encode(1)
        );
        vm.prank(address(8));
        tankGame.give(8, 6, 1, 0);
        uint256 hearts = tankGame.getTank(8).hearts;
        assertEq(hearts, 2);
        uint256 giverHearts = tankGame.getTank(6).hearts;
        assertEq(giverHearts, 4);
    }

    function testGiveAps() public {
        initGame();
        vm.mockCall(
            address(tankGame.getBoard()), abi.encodeWithSelector(HexBoard.getDistanceTanks.selector), abi.encode(1)
        );
        vm.prank(address(8));
        tankGame.give(8, 6, 0, 1);
        uint256 ap = tankGame.getTank(8).aps;
        assertEq(ap, 2);
        uint256 aps = tankGame.getTank(6).aps;
        assertEq(aps, 4);
    }

    function testGiveOutOfRange() public {
        initGame();
        vm.mockCall(
            address(tankGame.getBoard()), abi.encodeWithSelector(HexBoard.getDistanceTanks.selector), abi.encode(4)
        );
        vm.prank(address(1));
        vm.expectRevert("target out of range");
        tankGame.give(1, 2, 1, 0);
    }

    function testGiveTooMuchAp() public {
        initGame();
        vm.mockCall(
            address(tankGame.getBoard()), abi.encodeWithSelector(HexBoard.getDistanceTanks.selector), abi.encode(1)
        );
        vm.prank(address(8));
        vm.expectRevert("not enough action points");
        tankGame.give(8, 6, 0, 4);
    }

    function testGiveTooMuchHearts() public {
        initGame();
        vm.mockCall(
            address(tankGame.getBoard()), abi.encodeWithSelector(HexBoard.getDistanceTanks.selector), abi.encode(1)
        );
        vm.prank(address(8));
        vm.expectRevert("not enough hearts");
        tankGame.give(8, 6, 4, 0);
    }

    /// upgrade tests ///
    function testUpgrade() public {
        initGame();
        vm.prank(address(1));
        tankGame.upgrade(1);
        uint256 aps = tankGame.getTank(1).aps;
        uint256 range = tankGame.getTank(1).range;
        assertEq(range, 4);
        assertEq(aps, 0);
    }

    function testUpgraadeNotEnoughAps() public {
        initGame();
        vm.prank(address(1));
        tankGame.upgrade(1);
        vm.prank(address(1));
        vm.expectRevert("not enough action points");
        tankGame.upgrade(1);
    }

    function upgradeOtherTank() public {
        initGame();
        vm.prank(address(1));
        vm.expectRevert("not tank owner");
        tankGame.upgrade(2);
    }

    /// drip tests ///
    function testDrip() public {
        initGame();
        uint256 epochtime = tankGame.getSettings().epochSeconds;
        skip(epochtime);
        vm.prank(address(1));
        tankGame.drip(1);
        uint256 aps = tankGame.getTank(1).aps;
        assertEq(aps, 4);
    }

    function testDripTooEarly() public {
        initGame();
        vm.prank(address(1));
        vm.expectRevert("too early to drip");
        tankGame.drip(1);
    }

    function testDripInSameEpoch() public {
        initGame();
        uint256 epochtime = tankGame.getSettings().epochSeconds;
        skip(epochtime);
        vm.prank(address(1));
        tankGame.drip(1);
        vm.prank(address(1));
        vm.expectRevert("already dripped");
        tankGame.drip(1);
    }

    /// end game tests
    // @notice this offset logic is because there are precompiles at address 1, 2, 3, 4, 5  etc
    // if we try to transfer to them we get fucked.
    // importantly this is next n where killer needs to be at the front
    function killNPlayers(uint256 killerId, uint160 addressOffset, uint256 n) public {
        vm.mockCall(
            address(tankGame.getBoard()), abi.encodeWithSelector(HexBoard.getDistanceTanks.selector), abi.encode(1)
        );
        uint256 epochTime = tankGame.getSettings().epochSeconds;
        uint256 numplayers = tankGame.getSettings().playerCount;
        uint256 initHearts = tankGame.getSettings().initHearts;
        skip(epochTime * numplayers * initHearts);
        vm.prank(address(uint160(killerId + addressOffset)));
        tankGame.drip(killerId);
        for (uint160 i = uint160(killerId + 1); i <= killerId + n - 1; i++) {
            vm.prank(address(uint160(killerId + addressOffset)));
            tankGame.shoot(killerId, i, 3);
            console.log("tanks alive", tankGame.numTanksAlive());
        }
        assertTrue(tankGame.state() == ITankGame.GameState.Ended, "game should be over");
    }

    function testClaim() public {
        uint160 precompileOffset = 10_000;
        initGame(precompileOffset);
        killNPlayers(1, precompileOffset, 8);

        // number 1 wins, second is 7 and third is 8
        assertTrue(tankGame.state() == ITankGame.GameState.Ended, "game not ended");
        assertEq(tankGame.podium(0), 1, "first place is wrong");
        assertEq(tankGame.podium(1), 8, "second place is wrong");
        assertEq(tankGame.podium(2), 7, "third place is wrong");

        // do some claims
        vm.prank(address(1 + precompileOffset));
        tankGame.claim(1, address(1 + precompileOffset));

        vm.prank(address(8 + precompileOffset));
        tankGame.claim(8, address(8 + precompileOffset));

        vm.prank(address(7 + precompileOffset));
        tankGame.claim(7, address(7 + precompileOffset));

        assertEq(address(1 + precompileOffset).balance, 6 ether, "first place reward is wrong");
        assertEq(address(8 + precompileOffset).balance, 3 ether, "second place reward is wrong");
        assertEq(address(7 + precompileOffset).balance, 1 ether, "third place reward is wrong");
    }

    function testRecievePrizeDonation() public {
        uint256 prizeAmountBefore = tankGame.prizePool();
        hoax(address(1), 1 ether);
        tankGame.donate{ value: 1 ether }();
        assertEq(address(tankGame).balance - prizeAmountBefore, 1 ether);
        assertEq(tankGame.prizePool() - prizeAmountBefore, 1 ether);
    }
    /// helper

    // function _printBoard() public {
    //     uint256 boardSize = tankGame.board().boardSize();
    //     console.log("_________________________________________");
    //     for (uint256 i = 0; i < boardSize; i++) {
    //         string memory line = "| ";
    //         for (uint256 j = 0; j < boardSize; j++) {
    //             uint256 tankId = tankGame.tanksOnBoard(tankGame.pointToIndex(Board.Point(i, j)));
    //             if (tankId == 0) {
    //                 line = string.concat(line, "  | ");
    //             } else {
    //                 line = string.concat(line, Strings.toString(tankId), " | ");
    //             }
    //         }
    //         console.log(line);
    //         console.log("_________________________________________");
    //     }
    // }

    // function _printBoardIndex() public {
    //     uint256 boardSize = tankGame.settings().boardSize;
    //     for (uint256 i = 0; i < boardSize; i++) {
    //         for (uint256 j = 0; j < boardSize; j++) {
    //             uint256 tankId = tankGame.tanksOnBoard(tankGame.pointToIndex(ITankGame.Point(i, j)));
    //             console.log(i, j, tankId);
    //         }
    //     }
    // }
}
