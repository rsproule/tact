import { Request, Response, NextFunction, Router } from "express";
import { tankGameABI, tankGameAddress } from "../../frontend/src/generated";
import publicClient from "../api/viem";
var txRouter = Router();

txRouter.post("/sim", simHandler);
txRouter.post("/send", sendHandler);

function simHandler(req: Request, res: Response, next: NextFunction) {
  const { from, action, params } = req.body;
  const chainId = publicClient.chain?.id;
  publicClient
    .simulateContract({
      address: tankGameAddress[chainId as keyof typeof tankGameAddress],
      abi: tankGameABI,
      functionName: action,
      account: from,
      args: [params],
    })
    .then((result) => {
      console.log(result);
      res.send("sim");
    })
    .catch((err) => {
      res.send(err.shortMessage);
    });
}
function sendHandler(req: Request, res: Response, next: NextFunction) {
  res.send("");
}
export default txRouter;
