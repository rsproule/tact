// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/TankGame.sol";
import "../src/ITankGame.sol";

contract TankGameDeployerScript is Script {
    TankGame public tankGame;

    function run() public {
        vm.broadcast();
        ITankGame.GameSettings memory gs = ITankGame.GameSettings({
            playerCount: 4,
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
        console.log("TankGame deployed at address: %s", address(tankGame));
    }

}
