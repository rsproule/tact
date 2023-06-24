import { getDefaultConfig } from "connectkit";
import { goerli } from "viem/chains";
import { createConfig } from "wagmi";
const walletConnectProjectId = process.env.WALLET_CONNECT_APP!;

export const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: "Tank Turn Tactics",
    walletConnectProjectId,
    // chains: [tenderly],
    chains: [goerli],
  })
);
