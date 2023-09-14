import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import { getAddress } from "ethers";

// (1)
const values = [
  [getAddress("0x5337122c6b5ce24d970ce771510d22aeaf038c44"), "ryan"],
  [getAddress("0xc15ebb4f1ac7f1c5d94db64a472e1718fa6b6dec"), "kinjal"],
  [getAddress("0x3aab3396fede536accb3a578cd96617092270536"), "yuan"],
  [getAddress("0x0ba85c9e1863e5efb8395a55cd042d61decd6e89"), "anay"],
  [getAddress("0x259a3ab4a06d647380b046249ef3b12db212dc3e"), "spencer"],
  [getAddress("0x3fb9a5f2158716a2ed1aafc4539e5a24feb2e4a8"), "jay"],
  [getAddress("0x2fc7c69fdccea8ab0ac395d180b07f6e93db1b4d"), "joshua"],
  [getAddress("0xe0e9a1807802a32544570832fe5a21ea09500872"), "shishi"],
  [getAddress("0x9f90a3c2c1938f248241414754d977b897fb3fc5"), "sterling"],
  [getAddress("0x2cb8636240693b445ac98f2091b58a898e35e60b"), "joe"],
  [getAddress("0xb7430de9b4d8e5cdb951019d7651cd5fda630498"), "sam"],
  [getAddress("0xb100d1e55c42a72a28fba012bb77ad9a497358b8"), "mason"],
  [getAddress("0xac56bf73e73e252e962958b856d88f8264a2f2ab"), "daniel"],
  [getAddress("0x1f08eb0a5f08117d3302212139d3804cf4810de8"), "pat"],
  [getAddress("0x6c915b7d41566fa58b15962d829591ede914fc34"), "will"],
  [getAddress("0xb3c296170c57a7510bb95ef2e9c47977bc2ff1c8"), "caleb"],
  [getAddress("0xda744dacea631029430fd63d83b26f757e054cb7"), "brian"],
  [getAddress("0x14174a3f8868b4b6ab023853e2ff5903ea0fd015"), "carra"],
  [getAddress("0x60de91d489D41FAF4C42F5734fF5E8c95A0990F9"), "hopper"],
  //   (getAddress("0x5337122c6b5ce24D970Ce771510D22Aeaf038C44"), "ryan")
  // ],
  // [getAddress("0xC15ebb4f1aC7F1C5D94dB64a472e1718fa6b6dEc"), "kinjal"],
  // [getAddress("0x3Aab3396Fede536ACCB3a578CD96617092270536"), "yuan"],
  // [getAddress("0x0ba85c9e1863E5efB8395a55cd042d61DECD6e89"), "anay"],
  // [getAddress("0x259A3AB4A06d647380B046249ef3b12dB212Dc3e"), "spencer"],
  // [getAddress("0x3FB9a5F2158716a2eD1AAFc4539E5A24feB2E4a8"), "jay"],
  // [getAddress("0x2FC7C69FdcCEa8ab0AC395d180B07F6E93Db1B4d"), "joshua"],
  // [getAddress("0xE0E9A1807802a32544570832Fe5a21Ea09500872"), "shishi"],
  // [getAddress("0x859B7FA9b70746720bdeA1453D04161F3C829684"), "yigit"],
  // [getAddress("0x9f90a3C2c1938F248241414754d977B897Fb3Fc5"), "sterling"],
  // [getAddress("0x2cb8636240693b445ac98f2091b58a898e35e60b"), "joe"],
  // [getAddress("0xb7430de9B4D8e5cDB951019d7651cD5fda630498"), "sam"],
  // [getAddress("0xb100d1E55c42a72a28fbA012bB77aD9a497358b8"), "mason"],
  // [getAddress("0xac56Bf73E73e252e962958B856d88F8264A2F2Ab"), "daniel"],
  // [getAddress("0xbf0E0d8797d31fdDb2073B51eC5F78B56382643f"), "brad"],
  // [getAddress("0x1f08eB0a5F08117D3302212139d3804Cf4810de8"), "pat"],
  // [getAddress("0x6c915B7d41566fA58b15962D829591edE914Fc34"), "will"],
  // [getAddress("0xB3c296170c57A7510Bb95EF2E9C47977bC2FF1c8"), "caleb"],
  // [getAddress("0xDA744DaCea631029430FD63D83B26F757E054Cb7"), "brian"],
  // [getAddress("0x25C9745e0BA56fa7E40F9F8f61b7Fb49016cf342"), "phil"],
  // [getAddress("0x9B6A3e3A2C81464f873e54C07Ed947dd00938802"), "bot0"],
  // [getAddress("0xf940C90fb67A3992d55B676746669921457997e4"), "bot1"],
  // [getAddress("0xbf69051850247fdc1a8A27c3AD4F7951CE6977b1"), "bot2"],
  // [getAddress("0x7950787FE58E6cd7cB902773E8868c7F6F89d8eD"), "bot3"],
  // [getAddress("0xA16110c3dC7eEF79806C917ed0Bd7fA497c8580b"), "bot4"],
  // [getAddress("0xa192204d0E14233c5c09bB172CE38c2d2d7DDf1B"), "bot5"],
  // [getAddress("0xCc110bd48b55D483B19a4dd378B066dA6c3cD1fE"), "bot6"],
  // [getAddress("0x7219cA1F7d8045c5c757BaC01d6eC81D43504072"), "bot7"],
  // [getAddress("0x60848AFA93C83cA3eA7734E47c3dA155eB78B59B"), "bot8"],
  // [getAddress("0xe54B2534F74b857246Bd5854551F1178aa0BeA71"), "bot9"],
  // [getAddress("0x0541a3Aa3FA999EFE2596324bfeE79ACf11269Df"), "bot10"],
  // ["", "jonah"],
];

// (2)
const tree = StandardMerkleTree.of(values, ["address", "string"]);

// (3)
console.log("Merkle Root:", tree.root);

// (4)
fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
