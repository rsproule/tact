import { Request, Response, NextFunction, Router } from "express";
import { tankGameABI, tankGameAddress } from "../../frontend/src/generated";
var logsRouter = Router();
import publicClient from "../api/viem";

logsRouter.post("/", logHandler);

function logHandler(req: Request, res: Response, next: NextFunction) {
  getLogs(req.body.fromBlock).then((logs) => {
    res.send(
      JSON.parse(
        JSON.stringify(logs, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      )
    );
  });
}

async function getLogs(fromBlock: number) {
  const chainId = publicClient.chain?.id;
  const filter = await publicClient.createContractEventFilter({
    abi: tankGameABI,
    strict: true,
    fromBlock: BigInt(fromBlock),
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
  });
  return await publicClient.getFilterLogs({
    filter,
  });
}
export default logsRouter;
