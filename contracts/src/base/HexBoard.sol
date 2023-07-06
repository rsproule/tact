// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Board } from "src/interfaces/IBoard.sol";

contract HexBoard is Board {
    mapping(uint256 tankId => Board.Point point) public tankToPosition;
    mapping(uint256 position => uint256 heartCount) public heartsOnBoard;
    mapping(uint256 position => uint256 tankId) public tanksOnBoard;

    constructor(uint256 _boardSize) Board(_boardSize) { }

    function getDistance(Point memory a, Point memory b) internal pure override returns (uint256) {
        // TODO: handle wrapping!
        uint256 dx = a.x > b.x ? a.x - b.x : b.x - a.x;
        uint256 dy = a.y > b.y ? a.y - b.y : b.y - a.y;
        uint256 dz = a.z > b.z ? a.z - b.z : b.z - a.z;
        return dx + dy + dz;
    }

    function getDistanceTanks(uint256 tankA, uint256 tankB) external view override returns (uint256) {
        Point memory a = tankToPosition[tankA];
        Point memory b = tankToPosition[tankB];
        return getDistance(a, b);
    }

    function getDistanceTankToPoint(uint256 tankA, Point memory b) external view override returns (uint256) {
        Point memory a = tankToPosition[tankA];
        return getDistance(a, b);
    }

    function getDistanceIndex(uint256 indexA, uint256 indexB) external view override returns (uint256) {
        Point memory a = indexToPoint(indexA);
        Point memory b = indexToPoint(indexB);
        return getDistance(a, b);
    }

    function pointToIndex(Point memory point) public view override returns (uint256) {
        uint256 boardSize = boardSize;
        return point.x + point.y * boardSize + point.z * (boardSize * boardSize);
    }

    function indexToPoint(uint256 index) public view override returns (Point memory) {
        uint256 boardSize = boardSize;
        uint256 z = index / (boardSize * boardSize);
        index = index % (boardSize * boardSize);
        uint256 y = index / boardSize;
        uint256 x = index % boardSize;
        return Point(x, y, z);
    }

    function randomPoint(uint256 seed) public view override returns (Point memory) {
        uint256 index = seed % (boardSize * boardSize * boardSize);
        return indexToPoint(index);
    }

    function getEmptyTile(uint seed) public view override returns (Point memory) {
        Point memory point = randomPoint(seed);
        uint256 index = pointToIndex(point);
        uint256 tries = 1;
        while (heartsOnBoard[index] > 0 || tanksOnBoard[index] > 0) {
            seed = uint256(keccak256(abi.encodePacked(index, tries)));
            point = randomPoint(seed);
            index = pointToIndex(point);
            tries++;
        }
        return point;
    }

    function setTile(Point memory point, Tile memory tile) public override {
        uint256 index = pointToIndex(point);
        tankToPosition[tile.tankId] = point;
        heartsOnBoard[index] = tile.hearts;
        tanksOnBoard[index] = tile.tankId;
    }

    function getTile(Point memory point) public view override returns (Tile memory) {
        return Tile(tanksOnBoard[pointToIndex(point)], heartsOnBoard[pointToIndex(point)]);
    }

    function getTankPosition(uint256 tankId) public view override returns (Point memory) {
        return tankToPosition[tankId];
    }

    function getPerimeterForRadius(uint256 radius) public pure override returns (uint256) {
        return 6 * radius;
    }
}
