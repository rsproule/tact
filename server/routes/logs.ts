import { Request, Response, NextFunction, Router } from "express";
import { tankGameABI, tankGameAddress } from "../../frontend/src/generated";
var logsRouter = Router();
import publicClient from "../api/viem";

logsRouter.get("/", function (req: Request, res: Response, next: NextFunction) {
  getLogs().then((logs) => {
    res.send(
      JSON.stringify(logs, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  });
});

const getLogs = async () => {
  const chainId = publicClient.chain?.id;
  const filter = await publicClient.createContractEventFilter({
    abi: tankGameABI,
    strict: true,
    fromBlock: BigInt(0),
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
  });
  return await publicClient.getFilterLogs({
    filter,
  });
};
export default logsRouter;
