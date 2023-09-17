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

    event HookCreated(ITankGame indexed tankGame, HookRegistry _type, uint256 tankId, address owner);

    function createHook(ITankGame tankGame, uint256 tankId, HookRegistry hookType) external returns (IHooks) {
        if (hookType == HookRegistry.NonAggression) {
            return new NonAggression(tankGame, tankId);
        } else if (hookType == HookRegistry.Bounty) {
            return new Bounty(tankGame, tankId);
        } else {
            revert("HookFactory: invalid hook type");
        }
    }
}
