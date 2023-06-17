import { getDefaultConfig } from "connectkit";
import { Chain, hardhat, mainnet } from "viem/chains";
import { createConfig } from "wagmi";

const walletConnectProjectId = "7d01565eed713e531ec3250b719ce154";

const tenderly = {
  id: 1,
  network: "homestead",
  name: "Tenderly Test Fork",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        "https://rpc.tenderly.co/fork/344d077b-9dcb-42e3-b3fd-bea2a05f8dae",
      ],
    },
    public: {
      http: [
        "https://rpc.tenderly.co/fork/344d077b-9dcb-42e3-b3fd-bea2a05f8dae",
      ],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
    default: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
  },
  contracts: {
    ensRegistry: {
      address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    },
    ensUniversalResolver: {
      address: "0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da",
      blockCreated: 16773775,
    },
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 14353601,
    },
  },
} as const satisfies Chain;

export const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: "Tanks",
    walletConnectProjectId,
    chains: [tenderly],
    // chains: [hardhat, tenderly],
  })
);
