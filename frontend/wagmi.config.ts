import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    foundry({
      deployments: {
        ITankGame: {
          [chains.mainnet.id]: "0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743",
          [chains.foundry.id]: "0xCafac3dD18aC6c6e92c921884f9E4176737C052c",
          [chains.goerli.id]: "0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743",
        },
        TankGame: {
          [chains.mainnet.id]: "0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743",
          [chains.foundry.id]: "0xCafac3dD18aC6c6e92c921884f9E4176737C052c",
          [chains.goerli.id]: "0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743",
        },
        GameView: {
          [chains.foundry.id]: "0xAFf0E741b60288110bA7a400Ef6a99917faA593c",
          [chains.goerli.id]: "0xAFf0E741b60288110bA7a400Ef6a99917faA593c",
        },
        TankGameFactory: {
          [chains.foundry.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
          [chains.goerli.id]: "0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08",
        },
        HookFactory: {
          [chains.foundry.id]: "0x1397a0540F1CA3604518483F534E83fbeB60beF6",
          [chains.goerli.id]: "0x1397a0540F1CA3604518483F534E83fbeB60beF6",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
