import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    foundry({
      deployments: {
        TankGame: {
          [chains.mainnet.id]: "0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac",
          [chains.goerli.id]: "0x78991BB1D194C1235fe285240af8489CFA552151",
          [chains.foundry.id]: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
