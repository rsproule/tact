// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Board } from "src/interfaces/IBoard.sol";
import { ITankGame } from "src/interfaces/ITankGame.sol";

contract HexBoard is Board {
    mapping(uint256 tankId => Board.Point point) public tankToPosition;
    mapping(uint256 position => uint256 heartCount) public heartsOnBoard;
    mapping(uint256 position => uint256 tankId) public tanksOnBoard;

    constructor(uint256 _boardSize) Board(_boardSize) { }

    function getTotalTiles() public view override returns (uint256) {
        uint256 boardSize = boardSize;
        return 3 * boardSize * (boardSize + 1) + 1;
    }

    function getDistance(Point memory a, Point memory b) external pure override returns (uint256) {
        return _getDistance(a, b);
    }

    function _getDistance(Point memory a, Point memory b) internal pure returns (uint256) {
        // TODO: handle wrapping!
        uint256 dx = a.x > b.x ? a.x - b.x : b.x - a.x;
        uint256 dy = a.y > b.y ? a.y - b.y : b.y - a.y;
        uint256 dz = a.z > b.z ? a.z - b.z : b.z - a.z;
        return (dx + dy + dz) / 2;
    }

    function getDistanceTanks(uint256 tankA, uint256 tankB) external view override returns (uint256) {
        Point memory a = tankToPosition[tankA];
        Point memory b = tankToPosition[tankB];
        return _getDistance(a, b);
    }

    function getDistanceTankToPoint(uint256 tankA, Point memory b) external view override returns (uint256) {
        Point memory a = tankToPosition[tankA];
        return _getDistance(a, b);
    }

    function pointToIndex(Point memory point) public view override returns (uint256) {
        uint256 boardSize = boardSize;
        return point.x + point.y * boardSize + point.z * (boardSize * boardSize);
    }

    function isValidPoint(Point memory point) public view override returns (bool) {
        // invariant of the hex board is that we are on the plane x + y + z = 3 * boardSize
        return point.x + point.y + point.z == 3 * boardSize
            && _getDistance(point, Point(boardSize, boardSize, boardSize)) <= boardSize;
    }

    // TODO: there is a way to do this deterministically, this is wasting gas.
    // the problem is we are generating points over a rhombus, not a hexagon, so
    // in case we are on the outside of the hexagon we try again. jank.
    function randomPoint(uint256 seed) public view override returns (Point memory) {
        uint256 q;
        uint256 r;
        uint256 s;
        uint256 i = 1;
        uint256 boardSize = boardSize;
        do {
            q = i + seed % (2 * boardSize);
            r = 2 * boardSize - q > 0 ? uint256(keccak256(abi.encodePacked(seed))) % (2 * boardSize - q) : 0;
            s = 3 * boardSize - q - r;
            i++;
        } while (!isValidPoint(Point(q, r, s)));

        return Point(q, r, s);
    }

    function getEmptyTile(uint256 seed) public view override returns (Point memory) {
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
