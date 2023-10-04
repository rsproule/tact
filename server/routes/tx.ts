import { Request, Response, NextFunction, Router } from "express";
var txRouter = Router();

txRouter.get("/sim", simHandler);
txRouter.get("/send", sendHandler);

function sendHandler(req: Request, res: Response, next: NextFunction) {
  res.send("");
}
function simHandler(req: Request, res: Response, next: NextFunction) {
  res.send("");
}
export default txRouter;
