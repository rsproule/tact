// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";

contract TankGameFactory {
    using Clones for address;

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
        address gameAddress = address(game);
        emit GameCreated(gameAddress, settings);
    }
}
