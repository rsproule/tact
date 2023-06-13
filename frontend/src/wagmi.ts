import { getDefaultConfig } from "connectkit";
import { hardhat } from "viem/chains";
import { createConfig } from "wagmi";

const walletConnectProjectId = "7d01565eed713e531ec3250b719ce154";

export const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: "Tanks",
    walletConnectProjectId,
    chains: [hardhat],
  })
);
