// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { TankGame } from "src/base/TankGameV2.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { IHooks } from "src/interfaces/IHooks.sol";
import { NonAggression } from "src/hooks/NonAggression.sol";
import { Bounty } from "src/hooks/Bounty.sol";

contract HookFactory {
    enum HookRegistry {
        NonAggression,
        Bounty
    }

    event HookCreated(
        ITankGame indexed tankGame, HookRegistry _type, address hookAddress, uint256 tankId, address creator
    );

    function createHook(ITankGame tankGame, uint256 tankId, HookRegistry hookType) external returns (IHooks) {
        if (hookType == HookRegistry.NonAggression) {
            NonAggression na = new NonAggression(tankGame, tankId);
            emit HookCreated(tankGame, hookType, address(na), tankId, msg.sender);
            return na;
        } else if (hookType == HookRegistry.Bounty) {
            Bounty b = new Bounty(tankGame, tankId);
            emit HookCreated(tankGame, hookType, address(b), tankId, msg.sender);
            return b;
        } else {
            revert("HookFactory: invalid hook type");
        }
    }
}
