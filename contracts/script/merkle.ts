import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

// (1)
const values = [
  ["0x5337122c6b5ce24D970Ce771510D22Aeaf038C44"], // ryan
  ["0xC15ebb4f1aC7F1C5D94dB64a472e1718fa6b6dEc"], // kinjal
  ["0x3Aab3396Fede536ACCB3a578CD96617092270536"], // yuan
  ["0x0ba85c9e1863E5efB8395a55cd042d61DECD6e89"], // anay
  ["0x259A3AB4A06d647380B046249ef3b12dB212Dc3e"], // spencer
  ["0x3FB9a5F2158716a2eD1AAFc4539E5A24feB2E4a8"], // jay
  ["0x2FC7C69FdcCEa8ab0AC395d180B07F6E93Db1B4d"], // joshua
  ["0xE0E9A1807802a32544570832Fe5a21Ea09500872"], // shishi
  ["0x859B7FA9b70746720bdeA1453D04161F3C829684"], // yigit
  ["0x9f90a3C2c1938F248241414754d977B897Fb3Fc5"], // sterling
  ["0x2cb8636240693b445ac98f2091b58a898e35e60b"], // joe
  ["0xb7430de9B4D8e5cDB951019d7651cD5fda630498"], // sam
  ["0xb100d1E55c42a72a28fbA012bB77aD9a497358b8"], // mason
  ["0xac56Bf73E73e252e962958B856d88F8264A2F2Ab"], // daniel
  ["0xbf0E0d8797d31fdDb2073B51eC5F78B56382643f"], // brad
  [""], // jonah
  [""], // caleb
  [""], // will
];

// (2)
const tree = StandardMerkleTree.of(values, ["address"]);

// (3)
console.log("Merkle Root:", tree.root);

// (4)
fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
