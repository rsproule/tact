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
          [chains.goerli.id]: "0x692E97d2F99e0D595b1349a07a4733a3F5102E94",
        },
        TankGame: {
          [chains.mainnet.id]: "0x021dbff4a864aa25c51f0ad2cd73266fde66199d",
          [chains.foundry.id]: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
          [chains.goerli.id]: "0x692E97d2F99e0D595b1349a07a4733a3F5102E94",
        },
        GameView: {
          [chains.foundry.id]: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
          [chains.goerli.id]: "0x48E419cA3209e7318679cCFAf3D1c090fbEb7b83",
        },
        TankGameFactory: {
          [chains.foundry.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          [chains.goerli.id]: "0x26d0DadeAfeF0AefF3f2CcE09840830146E86A67",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
