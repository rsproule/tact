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
          [chains.goerli.id]: "0xD2605193cc30Be96F69DE74d4c5f5fD286f87650",
        },
        TankGame: {
          [chains.mainnet.id]: "0x021dbff4a864aa25c51f0ad2cd73266fde66199d",
          [chains.foundry.id]: "0xCafac3dD18aC6c6e92c921884f9E4176737C052c",
          [chains.goerli.id]: "0xD2605193cc30Be96F69DE74d4c5f5fD286f87650",
        },
        GameView: {
          [chains.foundry.id]: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
          [chains.goerli.id]: "0x82f32a46AA9c66d6d75B3AC61a82e5Dd3e958442",
        },
        // TankGameFactory: {
        //   [chains.foundry.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        //   [chains.goerli.id]: "",
        // },
        HookFactory: {
          [chains.foundry.id]: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
          [chains.goerli.id]: "0x55ee75ab3A7177aFc9390528EE31949839787d82",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
