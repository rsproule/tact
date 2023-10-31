// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
// import { TankGameFactory } from "src/base/TankGameFactory.sol";
import { TankGame } from "src/base/TankGameV2.sol";

contract StartGameScript is Script {
    function run() public {
        vm.startBroadcast();
        TankGame tankGame = TankGame(0xD2605193cc30Be96F69DE74d4c5f5fD286f87650);

        tankGame.start();
        vm.stopBroadcast();
    }
}
