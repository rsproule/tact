import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    foundry({
      deployments: {
        TankGame: {
          [chains.mainnet.id]: "0x4cf4dd3f71b67a7622ac250f8b10d266dc5aebce",
          [chains.foundry.id]: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
