// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Board } from "src/interfaces/IBoard.sol";
import { IHooks } from "src/interfaces/IHooks.sol";

interface ITankGame {
    struct GameSettings {
        uint256 playerCount;
        uint256 boardSize;
        uint256 initAPs;
        uint256 initHearts;
        uint256 initShootRange;
        uint256 epochSeconds;
        uint256 buyInMinimum;
        uint256 revealWaitBlocks;
        bytes32 root;
    }

    struct Tank {
        address owner;
        uint256 hearts;
        uint256 aps;
        uint256 range;
    }

    enum GameState {
        WaitingForPlayers,
        Started,
        Ended
    }

    struct JoinParams {
        address joiner;
        bytes32[] proof;
        string playerName;
    }

    function join(JoinParams calldata joinParams) external payable;

    // TODO: want to migrate to this eventually becuause we reuse the params in the hooks.
    // Problem is lots of refactoring required (both here and on frontend/bot)
    struct MoveParams {
        uint256 tankId;
        Board.Point to;
    }

    function move(MoveParams calldata moveParams) external;

    struct ShootParams {
        uint256 fromId;
        uint256 toId;
        uint256 shots;
    }

    function shoot(ShootParams calldata shootParams) external;

    struct GiveParams {
        uint256 fromId;
        uint256 toId;
        uint256 hearts;
        uint256 aps;
    }

    function give(GiveParams calldata giveParams) external;

    struct UpgradeParams {
        uint256 tankId;
    }

    function upgrade(UpgradeParams calldata upgradeParams) external;

    struct VoteParams {
        uint256 voter;
        uint256 cursed;
    }

    function vote(VoteParams calldata voteParams) external;

    struct ClaimParams {
        uint256 tankId;
        address claimer;
    }

    function claim(ClaimParams calldata claimParams) external;

    struct DelegateParams {
        uint256 tankId;
        address delegatee;
    }

    function delegate(DelegateParams calldata delegateParams) external;

    struct DripParams {
        uint256 tankId;
    }

    function drip(DripParams calldata dripParams) external;

    function reveal() external;

    function addHooks(uint256 tankId, IHooks hooks) external;

    // view functions

    function getPlayerCount() external view returns (uint256);

    function getTank(uint256 tankId) external view returns (Tank memory);

    function getBoard() external view returns (Board);

    function getSettings() external view returns (GameSettings memory);

    function getLastDrip(uint256 tankId) external view returns (uint256);

    function isAuth(uint256 tankId, address owner) external view returns (bool);
}
