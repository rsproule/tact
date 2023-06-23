import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    foundry({
      deployments: {
        TankGame: {
          [chains.mainnet.id]: "0x021dbff4a864aa25c51f0ad2cd73266fde66199d",
          [chains.foundry.id]: "0x95401dc811bb5740090279ba06cfa8fcf6113778",
          [chains.goerli.id]: "0x740d2B7c7f24DdB939FD108e8B8ba96E2187e861",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
