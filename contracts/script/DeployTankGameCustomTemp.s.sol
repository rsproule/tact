// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
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
        NamedPlayer[6] memory _staticAddresses = [
            NamedPlayer(0x5337122c6b5ce24D970Ce771510D22Aeaf038C44, "ryan"),
            NamedPlayer(0xb7430de9B4D8e5cDB951019d7651cD5fda630498, "sam"),
            NamedPlayer(0x60de91d489D41FAF4C42F5734fF5E8c95A0990F9, "hopper"),
            NamedPlayer(0x0, "emily"),
            NamedPlayer(0x0, "aidan")
        ];

        ITankGame.GameSettings memory gs = ITankGame.GameSettings({
            playerCount: _staticAddresses.length,
            boardSize: 21,
            initAPs: 1,
            initHearts: 3,
            initShootRange: 3,
            epochSeconds: 30 seconds,
            buyInMinimum: 0,
            revealWaitBlocks: (90 seconds) / 12,
            root: bytes32(0x0)
        });
        tankGame = new TankGame(gs, msg.sender);

        GameView gameView = new GameView(tankGame);
        HookFactory hookFactory = new HookFactory();
        console.log("TankGame deployed at address: %s", address(tankGame));
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
            IHooks nonAggro = hookFactory.createHook(tankGame, i + 1, HookFactory.HookRegistry.NonAggression);
            IHooks bounty = hookFactory.createHook(tankGame, i + 1, HookFactory.HookRegistry.Bounty);

            console.log("Adding bounty hook for %s at address %s", np.name, address(bounty));
            console.log("Adding nonaggression hook for %s at address %s", np.name, address(nonAggro));
            tankGame.forceAddDefaultHook(i + 1, nonAggro);
            tankGame.forceAddDefaultHook(i + 1, bounty);

            // done with default hooks. this is temporary solution

            // finance this player
            payable(np.player).transfer(0.1 ether); // the piggies are full
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
