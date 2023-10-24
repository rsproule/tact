// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Board } from "src/interfaces/IBoard.sol";
import { IHooks } from "src/interfaces/IHooks.sol";

interface ITankGame {
    event GameInit(ITankGame.GameSettings settings);
    event GameStarted();
    event PlayerJoined(address player, uint256 tankId, Board.Point position, string name);
    event Move(uint256 tankId, Board.Point position);
    event Shoot(uint256 tankId, uint256 targetId);
    event Give(uint256 fromId, uint256 toId, uint256 hearts, uint256 aps);
    event Upgrade(uint256 tankId, uint256 range);
    event Vote(uint256 voter, uint256 cursed, uint256 epoch);
    event Curse(uint256 cursedTank, uint256 voter, uint256 epoch);
    event Drip(uint256 tankId, uint256 amount, uint256 epoch);
    event Claim(address reciever, uint256 tankId, uint256 amount);
    event PrizeIncrease(address donator, uint256 amount, uint256 newTotal);
    event Death(uint256 killer, uint256 killed);
    event Revive(uint256 savior, uint256 saved);
    event SpawnHeart(address poker, Board.Point position);
    event Reveal(address poker, uint256 blocknumber);
    event Commit(address poker, uint256 blocknumber);
    event Delegate(uint256 tank, address delegate, address owner);
    event GameOver(uint256 winner, uint256 second, uint256 third, uint256 prizePool);
    event BountyCompleted(uint256 hunter, uint256 victim, uint256 reward);
    event HooksAdded(uint256 tankId, address hook);

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

    struct StateData {
        uint256 playersCount;
        uint256 numTanksAlive;
        uint256 prizePool;
        uint256 epochStart;
        uint256 aliveTanksIdSum;
        uint256 revealBlock;
        uint256 lastRevealBlock;
        address owner;
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

    function initialize(GameSettings calldata settings, address _owner) external payable;
}
