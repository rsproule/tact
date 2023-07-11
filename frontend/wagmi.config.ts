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
          [chains.foundry.id]: "0x763e69d24a03c0c8B256e470D9fE9e0753504D07",
          [chains.goerli.id]: "0x1D738bb3c3D594E248Fdb5234b7Af7a2Ecb7B64D",
          // [chains.goerli.id]: "0x0a8628a32f0AC3A208B8CEf032B38fF08bB140D7",
        },
        TankGame: {
          [chains.mainnet.id]: "0x021dbff4a864aa25c51f0ad2cd73266fde66199d",
          [chains.foundry.id]: "0x763e69d24a03c0c8B256e470D9fE9e0753504D07",
          [chains.goerli.id]: "0x1D738bb3c3D594E248Fdb5234b7Af7a2Ecb7B64D",
          // [chains.goerli.id]: "0x0a8628a32f0AC3A208B8CEf032B38fF08bB140D7",
        },
        GameView: {
          [chains.foundry.id]: "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F",
        },
        TankGameFactory: {
          [chains.foundry.id]: "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
