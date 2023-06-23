// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/TankGame.sol";
import "../src/ITankGame.sol";

import "lib/foundry-zksync-era/script/Deployer.sol";

contract ZkSyncDeployerScript is Script {
    TankGame public tankGame;

    function run() public {
        vm.broadcast();
        ITankGame.GameSettings memory gs = ITankGame.GameSettings({
            playerCount: 10,
            boardSize: 30,
            initAPs: 3,
            initHearts: 3,
            initShootRange: 3,
            upgradeCost: 3,
            epochSeconds: 4 hours,
            voteThreshold: 3,
            actionDelaySeconds: 0
        });
        // tankGame = new TankGame(gs);
        // console.log("TankGame deployed at address: %s", address(tankGame));
        // Diamond proxy addresses, last updated 24.03.2023
        address DIAMOND_PROXY_MAINNET = 0x32400084C286CF3E17e7B677ea9583e60a000324;
        address DIAMOND_PROXY_GOERLI = 0x1908e2BF4a88F91E4eF0DC72f02b8Ea36BEa2319;

        // Provide zkSync compiler version and address of the diamond proxy on L1
        // Deployer deployer = new Deployer("1.3.7", DIAMOND_PROXY_MAINNET);
        Deployer deployer = new Deployer("1.3.7", DIAMOND_PROXY_GOERLI);

        // Provide path to contract, input params & salt
        // Returns deployment address on L2
        deployer.deployFromL1(
            "src/TankGame.sol",
            abi.encode(gs), // TODO: not sure if this is the correct way to pass this
            bytes32(uint256(1337))
        );
    }
}
