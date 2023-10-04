import { PublicClient, createPublicClient, http } from "viem";
import { goerli, foundry } from "viem/chains";

const RPC_URL = process.env.RPC_URL!;

const publicClient: PublicClient = createPublicClient({
  chain: goerli,
  transport: http(RPC_URL),
});

export default publicClient;
