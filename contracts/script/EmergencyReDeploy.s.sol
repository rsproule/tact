// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/TankGame.sol";
import "../src/ITankGame.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EmergencyReDeploy is Script {
    TankGame public tankGame;

    function setUp() public {
        // the already depolyed contract
        tankGame = TankGame(0x1D738bb3c3D594E248Fdb5234b7Af7a2Ecb7B64D);
    }

    function run() public {
        TankGame.StateCheat memory cs = getCurrentState();
        vm.broadcast();
        TankGame newTankGame = TankGame(
            0x0a8628a32f0AC3A208B8CEf032B38fF08bB140D7
        );
        newTankGame.init(cs);
        console.log(
            "Re-initiaize state of tank game at address: %s",
            address(newTankGame)
        );
    }

    function getCurrentState()
        private
        view
        returns (TankGame.StateCheat memory)
    {
        uint playerCount = tankGame.playersCount();
        //// =================OVERRIDES======================= ///
        uint numTanksAlive = 4; // overriding
        uint skippedEpochs = 11; // overriding
        TankGame.GameState gameState = TankGame.GameState.Started; // overriding
        uint prizePool = 0;
        //// ================================================= ///
        uint epochStart = tankGame.epochStart();
        ITankGame.GameSettings memory gameSettings = tankGame.settings();
        // for each player, reconstruct the player state
        TankGame.TankLocation[] memory tankLocations = tankGame.getAllTanks();
        uint[] memory lastDripEpochs = new uint[](tankLocations.length);
        for (uint i = 0; i < tankLocations.length; i++) {
            TankGame.TankLocation memory updatedTl = tankLocations[i];
            lastDripEpochs[i] =
                tankGame.lastDripEpoch(updatedTl.tankId) +
                skippedEpochs;
        }
        return
            TankGame.StateCheat({
                playerCount: playerCount,
                numTanksAlive: numTanksAlive,
                prizePool: prizePool,
                gameState: gameState,
                epochStart: epochStart,
                gameSettings: gameSettings,
                tankLocations: tankLocations,
                lastDripEpoch: lastDripEpochs
            });
    }
}
