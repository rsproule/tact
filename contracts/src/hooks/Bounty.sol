// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { DefaultEmptyHooks } from "src/hooks/DefaultEmptyHooks.sol";
import { IHooks } from "src/interfaces/IHooks.sol";
import { ITreaty } from "src/interfaces/ITreaty.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";

contract Bounty is DefaultEmptyHooks {
    uint256 public ownerTank;
    ITankGame public tankGame;
    mapping(uint256 tankId => uint256 amount) public bounties;
    mapping(uint256 tankId => uint256 amount) public withdrawals;

    event BountyHookCreated(uint256 ownerTank, ITankGame tankGame);
    event BountyPosted(uint256 tankId, uint256 target, uint256 amount);
    event BountyWon(uint256 winner, uint256 victim, uint256 amount);
    event BountyWithdrawn(uint256 tankId, uint256 amount, address reciever);

    modifier hasTankAuth(uint256 tankId) {
        require(tankGame.isAuth(tankId, msg.sender), "Bounty: not owner");
        _;
    }

    constructor(ITankGame _tankGame, uint256 _ownerTank) {
        tankGame = _tankGame;
        // this should only be deployable by the guy that actually has auth on the tank
        // require(_tankGame.isAuth(_ownerTank, msg.sender), "Bounty: not owner");
        ownerTank = _ownerTank;
        emit BountyHookCreated(_ownerTank, tankGame);
    }

    function afterShoot(
        address,
        ITankGame.ShootParams memory shootParams,
        bytes memory
    )
        external
        override
        returns (bytes4)
    {
        uint256 targetTank = shootParams.toId;
        if (tankGame.getTank(targetTank).hearts <= 0) {
            uint256 bounty = bounties[targetTank];
            if (bounty > 0) {
                bounties[targetTank] = 0;
                withdrawals[shootParams.fromId] += bounty;
                emit BountyWon(shootParams.fromId, targetTank, bounty);
            }
        }
        return IHooks.afterShoot.selector;
    }

    function createBounty(uint256 targetTankId) external payable hasTankAuth(ownerTank) {
        bounties[targetTankId] += msg.value;
        emit BountyPosted(ownerTank, targetTankId, msg.value);
    }

    function withdrawBounty(uint256 tankId, address reciever) external {
        uint256 amount = withdrawals[tankId];
        require(amount > 0, "Bounty: no bounty to withdraw");
        withdrawals[tankId] = 0;
        payable(reciever).transfer(amount);
        emit BountyWithdrawn(tankId, amount, reciever);
    }
}
