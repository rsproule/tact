// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ITankGame } from "src/interfaces/ITankGame.sol";
import { Board } from "src/interfaces/IBoard.sol";

library ShootLib {
    function verifyShoot(
        ITankGame.ShootParams memory params,
        mapping(uint256 tankId => ITankGame.Tank tank) storage tanks,
        Board board
    )
        internal
        view
    {
        uint256 fromId = params.fromId;
        uint256 toId = params.toId;
        uint256 shots = params.shots;
        uint256 distance = board.getDistanceTanks(fromId, toId);
        require(distance <= tanks[fromId].range, "target out of range");
        require(tanks[fromId].aps >= shots, "not enough action points");
        require(shots <= tanks[toId].hearts, "too many shots");
    }

    function doShoot(
        ITankGame.ShootParams memory params,
        mapping(uint256 tankId => ITankGame.Tank tank) storage tanks
    )
        internal
        returns (bool death)
    {
        uint256 fromId = params.fromId;
        uint256 toId = params.toId;
        uint256 shots = params.shots;
        tanks[fromId].aps -= shots;
        tanks[toId].hearts -= shots;
        return tanks[toId].hearts <= 0;
    }
}
