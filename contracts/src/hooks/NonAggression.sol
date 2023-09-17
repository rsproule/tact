// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { DefaultEmptyHooks } from "src/hooks/DefaultEmptyHooks.sol";
import { IHooks } from "src/interfaces/IHooks.sol";
import { ITreaty } from "src/interfaces/ITreaty.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";

contract NonAggression is DefaultEmptyHooks, ITreaty {
    uint256 public ownerTank;
    ITankGame public tankGame;
    mapping(uint256 tankId => uint256 expiry) public proposals;
    mapping(uint256 tankId => uint256 expiry) public allies;

    event NonAggressionCreated(uint256 ownerTank, ITankGame tankGame);

    modifier hasTankAuth(uint256 tankId) {
        require(tankGame.isAuth(tankId, msg.sender), "NonAggression: not owner");
        _;
    }

    constructor(ITankGame _tankGame, uint256 _ownerTank) {
        // this should only be deployable by the guy that actually has auth on the tank
        // require(_tankGame.isAuth(_ownerTank, msg.sender), "NonAggression: not owner");
        tankGame = _tankGame;
        ownerTank = _ownerTank;
        emit NonAggressionCreated(_ownerTank, tankGame);
    }

    function beforeShoot(
        address,
        ITankGame.ShootParams memory shootParams,
        bytes memory
    )
        external
        view
        override
        returns (bytes4)
    {
        require(block.number > allies[shootParams.toId], "NonAggression: cannot shoot ally");
        return IHooks.beforeShoot.selector;
    }

    function accept(uint256 tankId, address treaty) external override {
        require(tankGame.isAuth(ownerTank, msg.sender) || msg.sender == treaty, "NonAggression: not owner");
        uint256 expiry = NonAggression(treaty).proposals(ownerTank);
        require(block.number < expiry, "NonAggression: proposal expired");

        allies[tankId] = expiry; // accept the proposal
        proposals[tankId] = expiry; // propose to other guy

        // if the other guy has already accepted us. we are allies, done.
        if (block.number > NonAggression(treaty).allies(ownerTank)) {
            propose(tankId, expiry);
            ITreaty(treaty).accept(ownerTank, address(this));
        }

        emit AcceptedTreaty(ownerTank, tankId, address(this), treaty, expiry);
    }

    function propose(uint256 tankId, uint256 expiry) public override hasTankAuth(ownerTank) {
        proposals[tankId] = expiry;
        emit ProposedTreaty(ownerTank, tankId, expiry);
    }
}
