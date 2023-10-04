import { Request, Response, NextFunction, Router } from "express";
var txRouter = Router();

txRouter.post("/sim", simHandler);
txRouter.post("/send", sendHandler);

function simHandler(req: Request, res: Response, next: NextFunction) {
  res.send("");
}
function sendHandler(req: Request, res: Response, next: NextFunction) {
  res.send("");
}
export default txRouter;
