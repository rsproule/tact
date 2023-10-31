import { NextFunction, Request, Response, Router } from "express";
import { tankGameABI, tankGameAddress } from "../../frontend/src/generated";
import publicClient from "../api/client";
import { foundry } from "viem/chains";
import { serializeTransaction } from "viem";
var txRouter = Router();

txRouter.post("/sim", simHandler);
txRouter.post("/send", sendHandler);

async function simHandler(req: Request, res: Response, next: NextFunction) {
  const { from, action, params, address } = req.body;
  try {
    let request = await publicClient.simulateContract({
      account: from,
      address: address,
      abi: tankGameABI,
      functionName: action,
      args: [params],
      chain: foundry,
    });

    let prepRequest = await publicClient.prepareTransactionRequest(
      request.request
    );
    console.log("prep request:", { ...prepRequest, abi: "OMITTED" });
    // let ts = serializeTransaction({

    //   chainId: prepRequest.chain?.id,
    //   gas: prepRequest.gas,
    //   // maxFeePerGas: prepRequest.maxFeePerGas,
    //   // maxPriorityFeePerGas: prepRequest.maxPriorityFeePerGas,
    //   nonce: prepRequest.nonce,
    //   to: prepRequest.to,
    //   value: prepRequest.value,
    //   type: "0x2",
    //   data: prepRequest.data,
    //   gasPrice: prepRequest.gasPrice,

    // });
    // console.log("serialized tx:", ts);
    const stringifiedPrepRequest = JSON.parse(
      JSON.stringify({ ...prepRequest, chainId: foundry.id}, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    return res.send(prepRequest);
    // @ts-ignore
    // let s = serializeTransaction({ ...prepRequest, chainId: foundry.id });
    // console.log(s);
    // return res.send(s);
  } catch (err: any) {
    console.log(err);
    return res.status(500).send(err.shortMessage);
  }
}

// the only purpose of passing this through the server is to parse the response
// nicely for the c++ client
function sendHandler(req: Request, res: Response, next: NextFunction) {
  console.log("signed tx:", req.body.signedTx);
  publicClient
    .sendRawTransaction(req.body.signedTx)
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      return res.send(err.shortMessage);
    });
}

export default txRouter;
