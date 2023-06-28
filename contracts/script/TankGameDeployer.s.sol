// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/TankGame.sol";
import "../src/ITankGame.sol";

contract TankGameDeployerScript is Script {
    TankGame public tankGame;

    function run() public {
        vm.broadcast();
        ITankGame.GameSettings memory gs = ITankGame.GameSettings({
            playerCount: 10,
            boardSize: 40,
            initAPs: 1,
            initHearts: 3,
            initShootRange: 3,
            upgradeCost: 3,
            epochSeconds: 4 hours,
            voteThreshold: 3, // not yet used
            actionDelaySeconds: 0
        });
        tankGame = new TankGame(gs);
        console.log("TankGame deployed at address: %s", address(tankGame));
    }
}
