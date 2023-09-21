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
          [chains.goerli.id]: "0x5947e5654E63aBB5Be710b9D7e7eB87AE884Fa42",
        },
        TankGame: {
          [chains.mainnet.id]: "0x021dbff4a864aa25c51f0ad2cd73266fde66199d",
          [chains.foundry.id]: "0xCafac3dD18aC6c6e92c921884f9E4176737C052c",
          [chains.goerli.id]: "0x5947e5654E63aBB5Be710b9D7e7eB87AE884Fa42",
        },
        GameView: {
          [chains.foundry.id]: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
          [chains.goerli.id]: "0xDe6a2a85ba9c36629E05fA6a4242917D4549cF47",
        },
        TankGameFactory: {
          [chains.foundry.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
          [chains.goerli.id]: "0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08",
        },
        HookFactory: {
          [chains.foundry.id]: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
          [chains.goerli.id]: "0x8c0AFDe8aA6D5118a05af4C0eCC0da7C1e31326e",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
