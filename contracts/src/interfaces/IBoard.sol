// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

abstract contract Board {
    uint256 public boardSize;

    constructor(uint256 _boardSize) {
        boardSize = _boardSize;
    }

    function getDistanceIndex(uint256 indexA, uint256 indexB) external view virtual returns (uint256);

    function getDistanceTanks(uint256 tankA, uint256 tankB) external view virtual returns (uint256);

    function getDistanceTankToPoint(uint256 tankA, Point memory b) external view virtual returns (uint256);

    function getDistance(Point memory a, Point memory b) internal pure virtual returns (uint256);

    function pointToIndex(Point memory point) external view virtual returns (uint256);

    function indexToPoint(uint256 index) external view virtual returns (Point memory);

    function randomPoint(uint256 seed) external view virtual returns (Point memory);

    function getEmptyTile(uint256 seed) external view virtual returns (Point memory);

    function setTile(Point memory point, Tile memory tile) external virtual;

    function getTile(Point memory point) external view virtual returns (Tile memory);

    function getTankPosition(uint256 tankId) external view virtual returns (Point memory);

    function getPerimeterForRadius(uint256 radius) external view virtual returns (uint256);

    struct Point {
        uint256 x;
        uint256 y;
        uint256 z;
    }

    struct Tile {
        uint256 tankId;
        uint256 hearts;
    }
}
