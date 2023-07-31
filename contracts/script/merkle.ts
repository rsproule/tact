import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

// (1)
const values = [
  ["0x5337122c6b5ce24D970Ce771510D22Aeaf038C44"],
  ["0x425374B4da782f0ec5DeC7b45B0C1e08dc6B5A65"],
  ["0x2a233E71Ba12fE39E587D402Acf4E41e8B008e31"],
  ["0x859B7FA9b70746720bdeA1453D04161F3C829684"],
  ["0xb7430de9B4D8e5cDB951019d7651cD5fda630498"],
  ["0x5CE306109b8de8d001d52F2140383A54AB55CdB2"],
  ["0xDC40CbF86727093c52582405703e5b97D5C64B66"],
  ["0x2CB8636240693B445ac98F2091b58A898e35e60B"],
  ["0xACAF2B49C521C83d80bFE5876A8e2418c99dc435"],
  ["0xE0E9A1807802a32544570832Fe5a21Ea09500872"],
];

// (2)
const tree = StandardMerkleTree.of(values, ["address"]);

// (3)
console.log("Merkle Root:", tree.root);

// (4)
fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
