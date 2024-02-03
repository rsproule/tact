import { getDefaultConfig } from "connectkit";
import { foundry, goerli } from "viem/chains";
import { createConfig, http } from "wagmi";
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_APP!;
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID!;

export const config = createConfig(
  getDefaultConfig({
    // autoConnect: true,
    appName: "Tact",
    walletConnectProjectId,
    transports: {
      [goerli.id]: http(`https://eth-goerli.alchemyapi.io/v2/${alchemyId}`),
      [foundry.id]: http(),
    },
    chains: [goerli, foundry],
  })
);
