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
          [chains.foundry.id]: "0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81",
          [chains.goerli.id]: "0x1D738bb3c3D594E248Fdb5234b7Af7a2Ecb7B64D",
          // [chains.goerli.id]: "0x0a8628a32f0AC3A208B8CEf032B38fF08bB140D7",
        },
        TankGame: {
          [chains.mainnet.id]: "0x021dbff4a864aa25c51f0ad2cd73266fde66199d",
          [chains.foundry.id]: "0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81",
          [chains.goerli.id]: "0x1D738bb3c3D594E248Fdb5234b7Af7a2Ecb7B64D",
          // [chains.goerli.id]: "0x0a8628a32f0AC3A208B8CEf032B38fF08bB140D7",
        },
        TankGameView: {
          [chains.foundry.id]: "0xC7f2Cf4845C6db0e1a1e91ED41Bcd0FcC1b0E141",
        },
        TankGameFactory: {
          [chains.foundry.id]: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
