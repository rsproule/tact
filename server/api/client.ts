import { PublicClient, createPublicClient, http } from "viem";
import { goerli, foundry } from "viem/chains";

const RPC_URL = process.env.RPC_URL!;
const CHAIN = process.env.CHAIN!;

const publicClient: PublicClient = createPublicClient({
  chain: CHAIN == "5" ? goerli : foundry,
  transport: http(RPC_URL),
});

export default publicClient;
