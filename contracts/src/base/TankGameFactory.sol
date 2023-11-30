// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { GameView } from "src/view/GameView.sol";
import { HookFactory } from "src/base/HookFactory.sol";
import { IHooks } from "src/interfaces/IHooks.sol";

contract TankGameFactory {
    using Clones for address;

    GameView public gameView;
    HookFactory public hookFactory;

    constructor(GameView _gameView, HookFactory _hookFactory) {
        gameView = _gameView;
        hookFactory = _hookFactory;
    }

    event GameCreated(address game, ITankGame.GameSettings settings);

    function createGame(
        address _implementation,
        ITankGame.GameSettings calldata settings,
        address _owner
    )
        external
        returns (ITankGame game)
    {
        game = ITankGame(_implementation.clone());
        game.initialize(settings, _owner);
        for (uint256 i = 0; i < settings.playerCount; i++) {
            // for every player give them a default hook for NonAggression and Bounties
            // this wont be allowed because hooks only added by owner
            // can get around this by allowing the admin to at the beginning
            IHooks nonAggro = hookFactory.createHook(game, gameView, i + 1, HookFactory.HookRegistry.NonAggression);
            IHooks bounty = hookFactory.createHook(game, gameView, i + 1, HookFactory.HookRegistry.Bounty);

            game.forceAddDefaultHook(i + 1, nonAggro);
            game.forceAddDefaultHook(i + 1, bounty);
        }

        address gameAddress = address(game);
        emit GameCreated(gameAddress, settings);
    }
}
