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
        NamedPlayer[19] memory _staticAddresses = [
            NamedPlayer(0x5337122c6b5ce24D970Ce771510D22Aeaf038C44, "ryan"),
            NamedPlayer(0xC15ebb4f1aC7F1C5D94dB64a472e1718fa6b6dEc, "kinjal"),
            NamedPlayer(0x3Aab3396Fede536ACCB3a578CD96617092270536, "yuan"),
            NamedPlayer(0x0ba85c9e1863E5efB8395a55cd042d61DECD6e89, "anay"),
            NamedPlayer(0x259A3AB4A06d647380B046249ef3b12dB212Dc3e, "spencer"),
            NamedPlayer(0x3FB9a5F2158716a2eD1AAFc4539E5A24feB2E4a8, "jay"),
            NamedPlayer(0x2FC7C69FdcCEa8ab0AC395d180B07F6E93Db1B4d, "joshua"),
            NamedPlayer(0xE0E9A1807802a32544570832Fe5a21Ea09500872, "shishi"),
            NamedPlayer(0x9f90a3C2c1938F248241414754d977B897Fb3Fc5, "sterling"),
            NamedPlayer(0x2CB8636240693B445ac98F2091b58A898e35e60B, "joe"),
            NamedPlayer(0xb7430de9B4D8e5cDB951019d7651cD5fda630498, "sam"),
            NamedPlayer(0xb100d1E55c42a72a28fbA012bB77aD9a497358b8, "mason"),
            NamedPlayer(0xac56Bf73E73e252e962958B856d88F8264A2F2Ab, "daniel"),
            NamedPlayer(0x1f08eB0a5F08117D3302212139d3804Cf4810de8, "pat"),
            NamedPlayer(0x6c915B7d41566fA58b15962D829591edE914Fc34, "will"),
            NamedPlayer(0xB3c296170c57A7510Bb95EF2E9C47977bC2FF1c8, "caleb"),
            NamedPlayer(0xDA744DaCea631029430FD63D83B26F757E054Cb7, "brian"),
            NamedPlayer(0x14174A3f8868b4b6Ab023853e2Ff5903Ea0fd015, "carra"),
            NamedPlayer(0x60de91d489D41FAF4C42F5734fF5E8c95A0990F9, "hopper")
        ];

        // TankGameFactory factory = new TankGameFactory();
        ITankGame.GameSettings memory gs = ITankGame.GameSettings({
            playerCount: _staticAddresses.length,
            boardSize: 30,
            initAPs: 1,
            initHearts: 3,
            initShootRange: 3,
            epochSeconds: 15 minutes,
            buyInMinimum: 0,
            revealWaitBlocks: (45 minutes) / 12,
            autoStart: false,
            root: bytes32(0x0)
        });
        tankGame = new TankGame();
        tankGame.initialize(gs, msg.sender);

        GameView gameView = new GameView();
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
        // tankGame.start();
        vm.stopBroadcast();
    }

    struct NamedPlayer {
        address player;
        string name;
    }
}
