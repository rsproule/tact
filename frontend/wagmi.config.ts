import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    foundry({
      deployments: {
        ITankGame: {
          [chains.mainnet.id]: "0x021dbff4a864aa25c51f0ad2cd73266fde66199d",
          [chains.foundry.id]: "0x3fA4E6e03Fbd434A577387924aF39efd3b4b50F2",
          [chains.goerli.id]: "0x1D738bb3c3D594E248Fdb5234b7Af7a2Ecb7B64D",
          // [chains.goerli.id]: "0x0a8628a32f0AC3A208B8CEf032B38fF08bB140D7",
        },
        TankGame: {
          [chains.mainnet.id]: "0x021dbff4a864aa25c51f0ad2cd73266fde66199d",
          [chains.foundry.id]: "0x3fA4E6e03Fbd434A577387924aF39efd3b4b50F2",
          [chains.goerli.id]: "0x1D738bb3c3D594E248Fdb5234b7Af7a2Ecb7B64D",
          // [chains.goerli.id]: "0x0a8628a32f0AC3A208B8CEf032B38fF08bB140D7",
        },
        GameView: {
          [chains.foundry.id]: "0x70e0bA845a1A0F2DA3359C97E0285013525FFC49",
        },
        TankGameFactory: {
          [chains.foundry.id]: "0x95401dc811bb5740090279Ba06cfA8fcF6113778",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
