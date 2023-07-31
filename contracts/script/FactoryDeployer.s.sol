// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
import { TankGameFactory } from "src/base/TankGameFactory.sol";
import { TankGame } from "src/base/TankGameV2.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { GameView } from "src/view/GameView.sol";

contract TankGameDeployerScript is Script {
    function run() public {
        vm.startBroadcast();
        TankGameFactory factory = new TankGameFactory();
        console.log("TankGameFactory at address: %s", address(factory));
        vm.stopBroadcast();
    }
}
