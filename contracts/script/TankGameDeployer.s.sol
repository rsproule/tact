// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
import { TankGameFactory } from "src/base/TankGameFactory.sol";
import { TankGame } from "src/base/TankGameV2.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { GameView } from "src/view/GameView.sol";

contract TankGameDeployerScript is Script {
    TankGame public tankGame;

    function run() public {
        vm.startBroadcast();
        TankGameFactory factory = new TankGameFactory();
        ITankGame.GameSettings memory gs = ITankGame.GameSettings({
            playerCount: 10,
            boardSize: 30, // needs to be divisible by 3
            initAPs: 3,
            initHearts: 3,
            initShootRange: 3,
            upgradeCost: 3, // TODO: this is no longer used
            epochSeconds: 1, // super short for testing 
            voteThreshold: 3, // TODO: this is never actually used 
            actionDelaySeconds: 0,
            buyInMinimum: 0,
            revealWaitBlocks: 10
        });
        tankGame = factory.createGame(gs);

        GameView gameView = new GameView(tankGame);
        console.log("TankGame deployed at address: %s", address(tankGame));
        console.log("TankGameFactory at address: %s", address(factory));
        console.log("TankGameView at address: %s", address(gameView));
        vm.stopBroadcast();
    }
}
