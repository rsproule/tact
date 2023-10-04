import { NextFunction, Request, Response, Router } from "express";
import { tankGameABI, tankGameAddress } from "../../frontend/src/generated";
import publicClient from "../api/client";
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
      return res.send(result.request);
    })
    .catch((err) => {
      return res.send(err.shortMessage);
    });
}

// the only purpose of passing this through the server is to parse the response
// nicely for the c++ client
function sendHandler(req: Request, res: Response, next: NextFunction) {
  publicClient
    .sendRawTransaction(req.body)
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      return res.send(err.shortMessage);
    });
}

export default txRouter;
