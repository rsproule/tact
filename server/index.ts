import express from "express";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import logsRouter from "./routes/logs";
import testRouter from "./routes/test";
import { Request, Response, NextFunction } from "express";
const app = express();
const port = 3000;

// view engine setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/logs", logsRouter);
app.use("/test", testRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

app.get("/logs", (req, res) => {
  logsRouter;
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
