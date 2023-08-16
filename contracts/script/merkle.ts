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
];

// (2)
const tree = StandardMerkleTree.of(values, ["address"]);

// (3)
console.log("Merkle Root:", tree.root);

// (4)
fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
