// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.19;

// import { Board } from "src/interfaces/IBoard.sol";

// contract SquareBoard is Board {
//     constructor(uint256 _boardSize) Board(_boardSize) { }

//     function getDistance(uint256 indexA, uint256 indexB) external view override returns (uint256) {
//         Point memory a = indexToPoint(indexA);
//         Point memory b = indexToPoint(indexB);
//         return getDistance(a, b);
//     }

//     function getDistance(Point memory a, Point memory b) internal pure returns (uint256) {
//         uint256 dx = a.x > b.x ? a.x - b.x : b.x - a.x;
//         uint256 dy = a.y > b.y ? a.y - b.y : b.y - a.y;
//         return dx + dy;
//     }

//     function pointToIndex(Point memory point) public view override returns (uint256) {
//         uint256 boardSize = boardSize;
//         return point.x + point.y * boardSize;
//     }

//     function indexToPoint(uint256 index) public view override returns (Point memory) {
//         uint256 boardSize = boardSize;
//         uint256 y = index / boardSize;
//         uint256 x = index % boardSize;
//         return Point(x, y, 0);
//     }
// }
