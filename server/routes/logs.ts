import { NextFunction, Request, Response, Router } from "express";
import { tankGameABI } from "../../frontend/src/generated";
import publicClient from "../api/client";
var logsRouter = Router();

logsRouter.post("/", logHandler);

function logHandler(req: Request, res: Response, next: NextFunction) {
  if (!req.body.address) {
    return res.status(400).send("address not provided");
  }
  getLogs(
    req.body.fromBlock !== undefined ? req.body.fromBlock : 0,
    req.body.address
  )
    .then((logs) => {
      res.send(
        // kinda hacky to handle the fact that BigInts are not JSON serializable
        JSON.parse(
          JSON.stringify(logs, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        )
      );
    })
    .catch((err) => {
      return res.status(500).send(err.message);
    });
}

async function getLogs(fromBlock: number, address: `0x${string}`) {
  const filter = await publicClient.createContractEventFilter({
    abi: tankGameABI,
    strict: true,
    fromBlock: BigInt(fromBlock),
    address: address,
  });
  return await publicClient.getFilterLogs({
    filter,
  });
}

export default logsRouter;
