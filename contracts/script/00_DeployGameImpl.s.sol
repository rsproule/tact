// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
import { TankGame } from "src/base/TankGameV2.sol";

contract DeployGameImpl is Script {
    function run() public {
        vm.startBroadcast();
        console.log("TankGameImpl deployed at address: %s", address(new TankGame()));
    }
}
