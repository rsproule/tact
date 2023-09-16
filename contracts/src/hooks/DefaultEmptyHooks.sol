// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IHooks } from "src/interfaces/IHooks.sol";
import { ITreaty } from "src/interfaces/ITreaty.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";

contract DefaultEmptyHooks is IHooks {
    function afterJoin(
        address,
        ITankGame.JoinParams memory,
        bytes memory
    )
        external
        pure
        virtual
        override
        returns (bytes4)
    {
        return IHooks.afterJoin.selector;
    }

    function beforeJoin(
        address,
        ITankGame.JoinParams memory,
        bytes memory
    )
        external
        pure
        virtual
        override
        returns (bytes4)
    {
        return IHooks.beforeJoin.selector;
    }

    function beforeGive(
        address,
        ITankGame.GiveParams memory,
        bytes memory
    )
        external
        pure
        virtual
        override
        returns (bytes4)
    {
        return IHooks.beforeGive.selector;
    }

    function afterGive(address, ITankGame.GiveParams memory, bytes memory) external virtual override returns (bytes4) {
        return IHooks.afterGive.selector;
    }

    function beforeMove(
        address,
        ITankGame.MoveParams memory,
        bytes memory
    )
        external
        virtual
        override
        returns (bytes4)
    {
        return IHooks.beforeMove.selector;
    }

    function afterMove(address, ITankGame.MoveParams memory, bytes memory) external virtual override returns (bytes4) {
        return IHooks.afterMove.selector;
    }

    function beforeShoot(
        address,
        ITankGame.ShootParams memory,
        bytes memory
    )
        external
        virtual
        override
        returns (bytes4)
    {
        return IHooks.beforeShoot.selector;
    }

    function afterShoot(
        address,
        ITankGame.ShootParams memory,
        bytes memory
    )
        external
        virtual
        override
        returns (bytes4)
    {
        return IHooks.afterShoot.selector;
    }

    function beforeUpgrade(
        address,
        ITankGame.UpgradeParams memory,
        bytes memory
    )
        external
        virtual
        override
        returns (bytes4)
    {
        return IHooks.beforeUpgrade.selector;
    }

    function afterUpgrade(
        address,
        ITankGame.UpgradeParams memory,
        bytes memory
    )
        external
        virtual
        override
        returns (bytes4)
    {
        return IHooks.afterUpgrade.selector;
    }

    function beforeVote(
        address,
        ITankGame.VoteParams memory,
        bytes memory
    )
        external
        virtual
        override
        returns (bytes4)
    {
        return IHooks.beforeVote.selector;
    }

    function afterVote(address, ITankGame.VoteParams memory, bytes memory) external virtual override returns (bytes4) {
        return IHooks.afterVote.selector;
    }

    function beforeClaim(
        address,
        ITankGame.ClaimParams memory,
        bytes memory
    )
        external
        pure
        virtual
        override
        returns (bytes4)
    {
        return IHooks.beforeClaim.selector;
    }

    function afterClaim(
        address,
        ITankGame.ClaimParams memory,
        bytes memory
    )
        external
        pure
        virtual
        override
        returns (bytes4)
    {
        return IHooks.afterClaim.selector;
    }

    function beforeDelegate(
        address,
        ITankGame.DelegateParams memory,
        bytes memory
    )
        external
        pure
        override
        returns (bytes4)
    {
        return IHooks.beforeDelegate.selector;
    }

    function afterDelegate(
        address,
        ITankGame.DelegateParams memory,
        bytes memory
    )
        external
        pure
        override
        returns (bytes4)
    {
        return IHooks.afterDelegate.selector;
    }

    function beforeDrip(address, ITankGame.DripParams memory, bytes memory) external pure override returns (bytes4) {
        return IHooks.beforeDrip.selector;
    }

    function afterDrip(address, ITankGame.DripParams memory, bytes memory) external pure override returns (bytes4) {
        return IHooks.afterDrip.selector;
    }

    function beforeReveal(address, bytes memory) external pure override returns (bytes4) {
        return IHooks.beforeReveal.selector;
    }

    function afterReveal(address, bytes memory) external virtual override returns (bytes4) {
        return IHooks.afterReveal.selector;
    }
}
