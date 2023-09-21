// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Board } from "src/interfaces/IBoard.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";

interface IHooks {
    function afterJoin(
        address gameId,
        ITankGame.JoinParams calldata joinParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function beforeJoin(
        address gameId,
        ITankGame.JoinParams calldata joinParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function beforeMove(
        address gameId,
        ITankGame.MoveParams calldata moveParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);
    function afterMove(
        address gameId,
        ITankGame.MoveParams calldata moveParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function beforeShoot(
        address gameId,
        ITankGame.ShootParams calldata shootParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function afterShoot(
        address gameId,
        ITankGame.ShootParams calldata shootParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function beforeGive(
        address gameId,
        ITankGame.GiveParams calldata giveParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function afterGive(
        address gameId,
        ITankGame.GiveParams calldata giveParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function beforeUpgrade(
        address gameId,
        ITankGame.UpgradeParams calldata upgradeParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function afterUpgrade(
        address gameId,
        ITankGame.UpgradeParams calldata upgradeParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function beforeVote(
        address gameId,
        ITankGame.VoteParams calldata voteParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);
    function afterVote(
        address gameId,
        ITankGame.VoteParams calldata voteParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function beforeClaim(
        address gameId,
        ITankGame.ClaimParams calldata claimParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);
    function afterClaim(
        address gameId,
        ITankGame.ClaimParams calldata claimParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function beforeDrip(
        address gameId,
        ITankGame.DripParams memory dripParams,
        bytes memory hookData
    )
        external
        returns (bytes4);

    function afterDrip(
        address gameId,
        ITankGame.DripParams memory dripParams,
        bytes memory hookData
    )
        external
        returns (bytes4);

    function beforeDelegate(
        address gameId,
        ITankGame.DelegateParams calldata delegateParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);
    function afterDelegate(
        address gameId,
        ITankGame.DelegateParams calldata delegateParams,
        bytes calldata hookData
    )
        external
        returns (bytes4);

    function beforeReveal(address gameId, bytes calldata hookData) external returns (bytes4);
    function afterReveal(address gameId, bytes calldata hookData) external returns (bytes4);
}
