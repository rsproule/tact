// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "../TankGame.sol";
import "../ITankGame.sol";

contract TankGameView {
    TankGame tankGame;

    constructor(TankGame tg) public {
        tankGame = tg;
    }

    /// readonly stuff used for frontend, move this to a view contract ///
    struct TankLocation {
        TankGame.Tank tank;
        ITankGame.Point position;
        uint tankId;
    }

    function getAllTanks() external view returns (TankLocation[] memory) {
        TankLocation[] memory tanksWithLocation = new TankLocation[](
            tankGame.playersCount()
        );
        for (uint i = 1; i <= tankGame.playersCount(); i++) {
            (uint x, uint y) = tankGame.tankToPosition(i);
            ITankGame.Point memory position = ITankGame.Point(x, y);
            (address owner, uint hearts, uint aps, uint range) = tankGame.tanks(
                i
            );
            TankGame.Tank memory tank = TankGame.Tank(
                owner,
                hearts,
                aps,
                range
            );
            tanksWithLocation[i - 1] = TankLocation(tank, position, i);
        }
        return tanksWithLocation;
    }
}
