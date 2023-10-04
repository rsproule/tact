import { Request, Response, NextFunction, Router } from "express";
var testRouter = Router();

testRouter.get(
  "/init",
  function (req: Request, res: Response, next: NextFunction) {
    res.send("sams little simulation thingy goes here");
  }
);
testRouter.get(
  "/kill",
  function (req: Request, res: Response, next: NextFunction) {
    res.send("kill the simulation");
  }
);
export default testRouter;
