import { getDefaultConfig } from "connectkit";
import { goerli, foundry } from "viem/chains";
import { createConfig } from "wagmi";
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_APP!;
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID!;

export const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: "TactV2",
    walletConnectProjectId,
    alchemyId: alchemyId,
    // chains: [goerli],
    chains: [foundry],
  })
);
