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
          [chains.goerli.id]: "0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414",
        },
        TankGame: {
          [chains.foundry.id]: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
          [chains.goerli.id]: "0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414",
        },
        GameView: {
          [chains.foundry.id]: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
          [chains.goerli.id]: "0xE19866944E2CD0FfaE4e35d168149b9B934eA471",
        },
        TankGameFactory: {
          [chains.foundry.id]: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
          [chains.goerli.id]: "0x9758ce8FE412C72893b42FFEdAEDff1840e1886f",

        },
        HookFactory: {
          [chains.foundry.id]: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
          [chains.goerli.id]: "0x2833Ee23DdAFa959D5ca459c6A64df2164B367b3",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
