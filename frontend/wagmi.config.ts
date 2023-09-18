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
          [chains.foundry.id]: "0xCafac3dD18aC6c6e92c921884f9E4176737C052c",
          [chains.goerli.id]: "0x692E97d2F99e0D595b1349a07a4733a3F5102E94",
        },
        TankGame: {
          [chains.mainnet.id]: "0x021dbff4a864aa25c51f0ad2cd73266fde66199d",
          [chains.foundry.id]: "0xCafac3dD18aC6c6e92c921884f9E4176737C052c",
          [chains.goerli.id]: "0x692E97d2F99e0D595b1349a07a4733a3F5102E94",
        },
        GameView: {
          [chains.foundry.id]: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
          [chains.goerli.id]: "0x48E419cA3209e7318679cCFAf3D1c090fbEb7b83",
        },
        TankGameFactory: {
          [chains.foundry.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
          [chains.goerli.id]: "0x26d0DadeAfeF0AefF3f2CcE09840830146E86A67",
        },
        HookFactory: {
          [chains.foundry.id]: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
          [chains.goerli.id]: "0x0000000000000000000000000000000000000000",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
