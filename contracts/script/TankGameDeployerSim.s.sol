// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
// import { TankGameFactory } from "src/base/TankGameFactory.sol";
import { TankGame } from "src/base/TankGameV2.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { GameView } from "src/view/GameView.sol";
import { NonAggression } from "src/hooks/NonAggression.sol";
import { Bounty } from "src/hooks/Bounty.sol";
import { HookFactory } from "src/base/HookFactory.sol";
import { IHooks } from "src/interfaces/IHooks.sol";

contract TankGameDeployerScript is Script {
    TankGame public tankGame;

    function run() public {
        vm.startBroadcast();
        address adminAddress = vm.envAddress("ADMIN_ADDRESS");
        NamedPlayer[3] memory _staticAddresses = [
            NamedPlayer(0x1000000000000000000000000000000000000101, "bot1"),
            NamedPlayer(0x1000000000000000000000000000000000000002, "bot2"),
            NamedPlayer(adminAddress, "admin")
        ];

        // TankGameFactory factory = new TankGameFactory();
        ITankGame.GameSettings memory gs = ITankGame.GameSettings({
            playerCount: _staticAddresses.length,
            boardSize: 30,
            initAPs: 1000,
            initHearts: 3,
            initShootRange: 3,
            epochSeconds: 1 seconds,
            buyInMinimum: 0,
            revealWaitBlocks: 45 seconds,
            autoStart: false,
            root: bytes32(0x0)
        });
        tankGame = new TankGame();
        tankGame.initialize(gs, msg.sender);

        GameView gameView = new GameView();
        HookFactory hookFactory = new HookFactory();
        console.log("TankGame at address: %s", address(tankGame));
        console.log("TankGameView at address: %s", address(gameView));
        console.log("HookFactory at address: %s", address(hookFactory));
        // join everyone.
        for (uint256 i = 0; i < _staticAddresses.length; i++) {
            NamedPlayer memory np = _staticAddresses[i];
            console.log("Joining %s at address %s", np.name, np.player);
            tankGame.join(ITankGame.JoinParams(np.player, new bytes32[](0), np.name));
            // for every player give them a default hook for NonAggression and Bounties
            // this wont be allowed because hooks only added by owner
            // can get around this by allownig the admin to at the beginning
            IHooks nonAggro = hookFactory.createHook(tankGame, gameView, i + 1, HookFactory.HookRegistry.NonAggression);
            IHooks bounty = hookFactory.createHook(tankGame, gameView, i + 1, HookFactory.HookRegistry.Bounty);

            console.log("Adding bounty hook for %s at address %s", np.name, address(bounty));
            console.log("Adding nonaggression hook for %s at address %s", np.name, address(nonAggro));
            tankGame.forceAddDefaultHook(i + 1, nonAggro);
            tankGame.forceAddDefaultHook(i + 1, bounty);

            // done with default hooks. this is temporary solution

            // finance this player
            // payable(np.player).transfer(0.1 ether); // the piggies are full
        }

        tankGame.setOwner(address(0));
        tankGame.start();
        vm.stopBroadcast();
    }

    struct NamedPlayer {
        address player;
        string name;
    }
}
