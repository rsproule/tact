// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
import { TankGameFactory } from "src/base/TankGameFactory.sol";
import { HookFactory } from "src/base/HookFactory.sol";
import { GameView } from "src/view/GameView.sol";

contract DeployTankGameFactories is Script {
    function run() public {
        vm.startBroadcast();
        HookFactory hookFactory = new HookFactory();
        GameView gameView = new GameView();
        console.log("HookFactory deployed at address: %s", address(hookFactory));
        console.log("View contract deployed at address: %s", address(gameView));
        console.log("TankGameFactory deployed at address: %s", address(new TankGameFactory(gameView, hookFactory)));
    }
}
