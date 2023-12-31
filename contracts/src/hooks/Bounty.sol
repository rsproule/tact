// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { DefaultEmptyHooks } from "src/hooks/DefaultEmptyHooks.sol";
import { IHooks } from "src/interfaces/IHooks.sol";
import { ITreaty } from "src/interfaces/ITreaty.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { IGameView } from "src/view/IGameView.sol";

contract Bounty is DefaultEmptyHooks {
    uint256 public ownerTank;
    address public tankGame;
    IGameView public tankGameView;
    mapping(uint256 tankId => uint256 bountyId) public bounties;
    mapping(uint256 bountyId => BountyData bountyData) public bountiesData;
    mapping(uint256 tankId => uint256 amount) public withdrawals;
    uint256 public bountyCount;

    struct BountyData {
        uint256 targetTankId;
        uint256 amount;
        bool closed;
    }

    event BountyHookCreated(uint256 ownerTank, address tankGame);
    event BountyPosted(uint256 bountyId, uint256 tankId, uint256 target, uint256 amount);
    event BountyWon(uint256 bountyId, uint256 winner, uint256 victim, uint256 amount);
    event Withdraw(uint256 tankId, uint256 amount, address reciever);

    modifier hasTankAuth(uint256 tankId) {
        // TODO: pass the address, do the casting in the view contract
        require(tankGameView.isAuth(tankGame, tankId, msg.sender), "Bounty: not owner");
        _;
    }

    constructor(address _tankGame, address _tankGameView, uint256 _ownerTank) {
        tankGame = _tankGame;
        // this should only be deployable by the guy that actually has auth on the tank
        // require(_tankGame.isAuth(_ownerTank, msg.sender), "Bounty: not owner");
        ownerTank = _ownerTank;
        tankGameView = IGameView(_tankGameView);
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
        if (tankGameView.getTank(tankGame, targetTank).hearts <= 0) {
            uint256 bountyId = bounties[targetTank];
            BountyData storage bounty = bountiesData[bountyId];
            if (bounty.amount > 0 && !bounty.closed) {
                bounty.closed = true;
                bountiesData[bountyId] = bounty;
                withdrawals[shootParams.fromId] += bounty.amount;
                emit BountyWon(bountyId, shootParams.fromId, targetTank, bounty.amount);
            }
        }
        return IHooks.afterShoot.selector;
    }

    function create(uint256 targetTankId) external payable hasTankAuth(ownerTank) {
        // if there is already a bounty on this tank, then we need to close it out
        require(msg.value > 0, "Bounty: no bounty to post");
        require(tankGameView.getTank(tankGame, targetTankId).owner != address(0), "Bounty: tank must exist");
        bountyCount++;
        uint256 bountyId = bounties[targetTankId];
        BountyData storage existent = bountiesData[bountyId];
        existent.closed = true;
        uint256 newAmount = existent.amount + msg.value;

        bounties[targetTankId] = bountyCount;
        bountiesData[bountyCount] = BountyData(targetTankId, newAmount, false);
        emit BountyPosted(bountyCount, ownerTank, targetTankId, newAmount);
    }

    function withdraw(uint256 tankId, address reciever) external {
        uint256 amount = withdrawals[tankId];
        require(amount > 0, "Bounty: no bounty to withdraw");
        withdrawals[tankId] = 0;
        payable(reciever).transfer(amount);
        emit Withdraw(tankId, amount, reciever);
    }

    function cancel(uint256 bountyId) external hasTankAuth(ownerTank) {
        require(tankGameView.getState(tankGame) == ITankGame.GameState.Ended, "Bounty: game not over");
        BountyData memory bounty = bountiesData[bountyId];

        bounty.closed = true;
        withdrawals[ownerTank] += bounty.amount;
    }
}
