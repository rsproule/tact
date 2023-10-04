import { Request, Response, NextFunction, Router } from "express";
var testRouter = Router();

testRouter.get("/init", initHandler);
testRouter.get("/kill", killHandler);

function initHandler(req: Request, res: Response, next: NextFunction) {
  res.send("sams little simulation thingy goes here");
}
function killHandler(req: Request, res: Response, next: NextFunction) {
  res.send("kill the simulation");
}
export default testRouter;
