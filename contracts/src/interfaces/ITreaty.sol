// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ITreaty {
    function propose(uint256 tankId, uint256 expiry) external;
    function accept(uint256 tankId, address hook) external;

    event ProposedTreaty(uint256 proposer, uint256 proposee, address proposalHook, uint256 expiry);
    event AcceptedTreaty(
        uint256 proposer, uint256 proposee, address hookProposer, address hookAccepter, uint256 expiry
    );
}
