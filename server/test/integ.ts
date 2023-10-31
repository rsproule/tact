import axios from "axios";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// const ethers = require("ethers");
// const signer = new ethers.Wallet(
//   "0x0123456789012345678901234567890123456789012345678901234567890123"
// );
// const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
// const wallet = signer.connect(provider);
const account = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);
console.log("account:", account.address);
// const walletClient = createWalletClient({
//   account,
//   transport: http(),
// });

const URL = "http://localhost:3000";
let initResponse = await axios.post(`${URL}/test/init`, {
  adminAddress: account.address,
});

const { TankGame, TankGameView } = initResponse.data;
console.log("tank game:", TankGame);

let logsResponse = await axios.post(`${URL}/logs`, {
  address: TankGame,
  fromBlock: 0,
});
console.log("init logs:", logsResponse.data.length);

let logsResponseNoFrom = await axios.post(`${URL}/logs`, {
  address: TankGame,
  fromBlock: 0,
});
console.log("init logs no from:", logsResponseNoFrom.data.length);

let { data: unsignedTx } = await axios.post(`${URL}/tx/sim`, {
  from: account.address,
  address: TankGame,
  action: "move",
  params: {
    tankId: 3,
    to: {
      x: 30,
      y: 30,
      z: 30,
    },
  },
});
// console.log("unsigned tx:", unsignedTx);
let signedTX = await account.signTransaction(unsignedTx);
// let signedTX = await account.signTransaction({
//   data: unsignedTx,
//   to: TankGame,
//   account: account.address,
//   value: BigInt(0),
//   type: "0x2",
// });

let { data: sendResponse } = await axios.post(`${URL}/tx/send`, {
  signedTx: signedTX,
});
console.log("send response:", sendResponse);
