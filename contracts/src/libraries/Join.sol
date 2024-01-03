// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";
import { Board } from "src/interfaces/IBoard.sol";

library JoinLib {
    function verifyJoin(
        ITankGame.JoinParams memory params,
        mapping(address player => uint256 tank) storage players,
        ITankGame.GameSettings memory settings,
        uint256 playersCount
    )
        internal
        view
    {
        // verify join
        require(players[params.joiner] == 0, "already joined");
        require(playersCount < settings.playerCount, "game is full");
        require(msg.value >= settings.buyInMinimum, "insufficient buy in");
        require(params.playerName.length > 0, "must provide name");
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(params.joiner, params.playerName))));
        require(settings.root == bytes32(0) || MerkleProof.verify(params.proof, settings.root, leaf), "invalid proof");
    }

    function doJoin(
        ITankGame.JoinParams memory params,
        Board board,
        mapping(uint256 tankId => ITankGame.Tank tank) storage tanks,
        mapping(address player => uint256 tank) storage players,
        ITankGame.GameSettings memory settings,
        ITankGame.StateData storage stateData
    )
        internal
        returns (Board.Point memory)
    {
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, params.joiner)));
        Board.Point memory emptyPoint = board.getEmptyTile(seed);
        ITankGame.Tank memory tank =
            ITankGame.Tank(params.joiner, settings.initHearts, settings.initAPs, settings.initShootRange);

        stateData.playersCount++;
        uint256 tankId = stateData.playersCount;
        stateData.numTanksAlive++;
        stateData.aliveTanksIdSum += tankId;
        tanks[tankId] = tank;
        players[params.joiner] = tankId;
        board.setTile(emptyPoint, Board.Tile({ tankId: tankId, hearts: 0 }));
        return emptyPoint;
    }
}
