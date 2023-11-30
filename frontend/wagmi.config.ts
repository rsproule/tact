import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";
export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    foundry({
      deployments: {
        ITankGame: {
          [chains.foundry.id]: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
          [chains.goerli.id]: "0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743",
        },
        TankGame: {
          [chains.foundry.id]: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
          [chains.goerli.id]: "0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743",
        },
        GameView: {
          [chains.foundry.id]: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
          [chains.goerli.id]: "0xAFf0E741b60288110bA7a400Ef6a99917faA593c",
        },
        TankGameFactory: {
          [chains.foundry.id]: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
          [chains.goerli.id]: "0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08",
        },
        HookFactory: {
          [chains.foundry.id]: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
          [chains.goerli.id]: "0x1397a0540F1CA3604518483F534E83fbeB60beF6",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
