// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { TankGame } from "src/base/TankGameV2.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";

contract TankGameFactory {
    event GameCreated(address game, ITankGame.GameSettings settings);

    function createGame(ITankGame.GameSettings calldata settings, address _owner) external returns (TankGame game) {
        game = new TankGame(settings, _owner);
        address gameAddress = address(game);
        emit GameCreated(gameAddress, settings);
    }
}
