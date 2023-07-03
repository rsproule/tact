// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../TankGame.sol";
import "../ITankGame.sol";

contract TankGameView {
    TankGame tankGame;

    constructor(TankGame tg) public {
        tankGame = tg;
    }

    struct TankLocation {
        TankGame.Tank tank;
        ITankGame.Point position;
        uint256 tankId;
    }

    function getAllTanks() external view returns (TankLocation[] memory) {
        TankLocation[] memory tanksWithLocation = new TankLocation[](
            tankGame.playersCount()
        );
        for (uint256 i = 1; i <= tankGame.playersCount(); i++) {
            (uint256 x, uint256 y) = tankGame.tankToPosition(i);
            ITankGame.Point memory position = ITankGame.Point(x, y);
            (address owner, uint256 hearts, uint256 aps, uint256 range) = tankGame.tanks(i);
            TankGame.Tank memory tank = TankGame.Tank(owner, hearts, aps, range);
            tanksWithLocation[i - 1] = TankLocation(tank, position, i);
        }
        return tanksWithLocation;
    }
}
