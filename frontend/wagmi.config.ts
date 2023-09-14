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
          [chains.goerli.id]: "0x460aA36C5f0A15483C114E48783c1354281b5780",
        },
        TankGame: {
          [chains.mainnet.id]: "0x021dbff4a864aa25c51f0ad2cd73266fde66199d",
          [chains.foundry.id]: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
          [chains.goerli.id]: "0x460aA36C5f0A15483C114E48783c1354281b5780",
        },
        GameView: {
          [chains.foundry.id]: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
          [chains.goerli.id]: "0xF992766F56cb1395A3584B73f1eb99149fb57f31",
        },
        TankGameFactory: {
          [chains.foundry.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          [chains.goerli.id]: "0xDB9a8A333f9c56c935d0a6328935bA5CB46D438F",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
