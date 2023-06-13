// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/TankGame.sol";
import "../src/ITankGame.sol";

contract FillGameScript is Script {
    TankGame public tankGame;

    function run() public {
        vm.startBroadcast();
        tankGame = TankGame(0x5FbDB2315678afecb367f032d93F642f64180aa3);
        initGame();
    }

    function initGame() public {
        uint playerCount = tankGame.settings().playerCount;
        for (uint160 i = 1; i < playerCount; i++) {
            // payable(address(i)).transfer(1 ether);
            vm.prank(address(i));
            tankGame.join();
        }
    }
}
