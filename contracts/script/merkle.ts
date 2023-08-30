import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import { getAddress } from "ethers";

// (1)
const values = [
  [getAddress("0x5337122c6b5ce24D970Ce771510D22Aeaf038C44"), "ryan"],
  [getAddress("0xC15ebb4f1aC7F1C5D94dB64a472e1718fa6b6dEc"), "kinjal"],
  [getAddress("0x3Aab3396Fede536ACCB3a578CD96617092270536"), "yuan"],
  [getAddress("0x0ba85c9e1863E5efB8395a55cd042d61DECD6e89"), "anay"],
  [getAddress("0x259A3AB4A06d647380B046249ef3b12dB212Dc3e"), "spencer"],
  [getAddress("0x3FB9a5F2158716a2eD1AAFc4539E5A24feB2E4a8"), "jay"],
  [getAddress("0x2FC7C69FdcCEa8ab0AC395d180B07F6E93Db1B4d"), "joshua"],
  [getAddress("0xE0E9A1807802a32544570832Fe5a21Ea09500872"), "shishi"],
  [getAddress("0x859B7FA9b70746720bdeA1453D04161F3C829684"), "yigit"],
  [getAddress("0x9f90a3C2c1938F248241414754d977B897Fb3Fc5"), "sterling"],
  [getAddress("0x2cb8636240693b445ac98f2091b58a898e35e60b"), "joe"],
  [getAddress("0xb7430de9B4D8e5cDB951019d7651cD5fda630498"), "sam"],
  [getAddress("0xb100d1E55c42a72a28fbA012bB77aD9a497358b8"), "mason"],
  [getAddress("0xac56Bf73E73e252e962958B856d88F8264A2F2Ab"), "daniel"],
  [getAddress("0xbf0E0d8797d31fdDb2073B51eC5F78B56382643f"), "brad"],
  [getAddress("0x1f08eB0a5F08117D3302212139d3804Cf4810de8"), "pat"],
  [getAddress("0x72Edd28063647BE9E87F6Df3f4de7138A1a5ceBA"), "will"],
  [getAddress("0xB3c296170c57A7510Bb95EF2E9C47977bC2FF1c8"), "caleb"],
  [getAddress("0xDA744DaCea631029430FD63D83B26F757E054Cb7"), "brian"],
  // ["", "jonah"],
];

// (2)
const tree = StandardMerkleTree.of(values, ["address", "string"]);

// (3)
console.log("Merkle Root:", tree.root);

// (4)
fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
