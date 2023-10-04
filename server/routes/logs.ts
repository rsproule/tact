import { Request, Response, NextFunction, Router } from "express";
var logsRouter = Router();
var publicClient = require("../api/viem");

logsRouter.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.send(getLogs());
});

function getLogs() {
  return "logs go here";
}

export default logsRouter;
