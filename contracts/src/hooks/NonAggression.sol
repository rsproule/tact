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
        uint256 epoch = ITankGame(tankGame).getGameEpoch();
        require(epoch > allies[shootParams.toId], "NonAggression: cannot shoot ally");
        return IHooks.beforeShoot.selector;
    }

    function accept(uint256 tankId, address treaty) external override {
        uint256 externalProposal = NonAggression(treaty).proposals(ownerTank);
        uint256 externalAlliance = NonAggression(treaty).allies(ownerTank);
        uint256 internalProposal = proposals[tankId];
        uint256 internalAlliance = allies[tankId];
        uint256 epoch = ITankGame(tankGame).getGameEpoch();
        require(epoch < externalProposal, "NonAggression: proposal expired");
        if (internalProposal == externalProposal) {
            // this is the loop back
            // require(internalAlliance != externalAlliance, "NonAggression: already allies");
            require(msg.sender == treaty, "NonAggression: invalid callback");
        } else {
            // this is the first loop
            require(internalProposal < externalProposal, "NonAggression: proposal expired");
            require(tankGame.isAuth(ownerTank, msg.sender), "NonAggression: not owner");
        }
        require(
            !_areAllies(externalProposal, internalProposal, externalAlliance, internalAlliance),
            "NonAggression: Already allies"
        );

        // if we are in state 1: first loop of accept
        proposals[tankId] = externalProposal;
        allies[tankId] = externalProposal;

        emit AcceptedTreaty(ownerTank, tankId, address(this), treaty, externalProposal);
        if (allies[tankId] != externalAlliance) {
            ITreaty(treaty).accept(ownerTank, address(this));
        }

        require(
            _areAllies(
                NonAggression(treaty).proposals(ownerTank),
                proposals[tankId],
                NonAggression(treaty).allies(ownerTank),
                allies[tankId]
            ),
            "NonAggression: Not allies"
        );
    }

    function _areAllies(uint256 eProp, uint256 iProp, uint256 eAlly, uint256 iAlly) internal pure returns (bool) {
        return eProp == iProp && eAlly == iAlly && eProp == eAlly;
    }

    function propose(uint256 tankId, uint256 expiry) public override hasTankAuth(ownerTank) {
        uint256 epoch = ITankGame(tankGame).getGameEpoch();
        require(epoch < expiry, "NonAggression: past expiry");
        proposals[tankId] = expiry;
        emit ProposedTreaty(ownerTank, tankId, address(this), expiry);
    }
}
