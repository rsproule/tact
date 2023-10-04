import { createPublicClient, http } from "viem"; 
import { foundry } from "viem/chains";

const client: ClientType = createPublicClient({
  chain: foundry,
  transport: http(),
});