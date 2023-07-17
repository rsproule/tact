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
          [chains.foundry.id]: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
          [chains.goerli.id]: "0x1D738bb3c3D594E248Fdb5234b7Af7a2Ecb7B64D",
          // [chains.goerli.id]: "0x0a8628a32f0AC3A208B8CEf032B38fF08bB140D7",
        },
        TankGame: {
          [chains.mainnet.id]: "0x021dbff4a864aa25c51f0ad2cd73266fde66199d",
          [chains.foundry.id]: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
          [chains.goerli.id]: "0x1D738bb3c3D594E248Fdb5234b7Af7a2Ecb7B64D",
          // [chains.goerli.id]: "0x0a8628a32f0AC3A208B8CEf032B38fF08bB140D7",
        },
        GameView: {
          [chains.foundry.id]: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        },
        TankGameFactory: {
          [chains.foundry.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
