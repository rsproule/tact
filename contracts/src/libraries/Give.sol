// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ITankGame } from "src/interfaces/ITankGame.sol";
import { Board } from "src/interfaces/IBoard.sol";

library GiveLib {
    function verifyGive(
        ITankGame.GiveParams memory params,
        mapping(uint256 tankId => ITankGame.Tank tank) storage tanks,
        Board board
    )
        public
        view
    {
        uint256 hearts = params.hearts;
        uint256 aps = params.aps;
        uint256 fromId = params.fromId;
        uint256 toId = params.toId;
        require(hearts <= tanks[fromId].hearts, "not enough hearts");
        require(aps <= tanks[fromId].aps, "not enough action points");
        uint256 distance = board.getDistanceTanks(fromId, toId);
        require(distance <= tanks[fromId].range, "target out of range");
    }

    function doGive(
        ITankGame.GiveParams memory params,
        mapping(uint256 tankId => ITankGame.Tank tank) storage tanks,
        ITankGame.StateData storage stateData,
        mapping(uint256 tankId => uint256 epoch) storage lastDripEpoch,
        uint256 epoch
    )
        public
        returns (bool fromDeath, bool toRevive)
    {
        uint256 hearts = params.hearts;
        uint256 aps = params.aps;
        uint256 fromId = params.fromId;
        uint256 toId = params.toId;
        tanks[fromId].hearts -= hearts;
        tanks[fromId].aps -= aps;
        if (tanks[toId].hearts <= 0) {
            stateData.numTanksAlive++;
            stateData.aliveTanksIdSum += toId;
            lastDripEpoch[toId] = epoch;
            toRevive = true;
        }
        tanks[toId].hearts += hearts;
        tanks[toId].aps += aps;
        fromDeath = tanks[fromId].hearts <= 0;
    }
}
