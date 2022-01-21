import express, { Request, Response } from "express";
import { EnvironmentConfig } from "../../configs/environment.config";
import { SystemVersionResponse } from "../../dataobjects/rest/response/systemVersion.response";
import * as responses from "../../services/helper/responses";

export const systemRouterV1 = express.Router();

systemRouterV1.get("/version", async (req: Request, res: Response) => {
  const responseBody: SystemVersionResponse = {
    version: EnvironmentConfig.VERSION
  }
  responses.respondStatus200OK(req, res, responseBody);
});