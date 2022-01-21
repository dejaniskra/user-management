import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { EnvironmentConfig } from "../../configs/environment.config";
import { PasswordChangeRequest } from "../../dataobjects/rest/request/passwordChange.request";
import * as responses from "../../services/helper/responses";
import * as devService from "../../services/dev.service";

export const devsRouterV1 = express.Router({
  mergeParams: true
});

devsRouterV1.get(
  "/users/:userId/codes",
  param("userId").isString().isAlphanumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const userId = req.params.userId as string;

      const responseBody = await devService.getCodesByUserId(userId);

      responses.respondStatus200OK(req, res, responseBody);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

devsRouterV1.delete(
  "/codes/:id",
  param("id").isString().isAlphanumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const codeId = req.params.id as string;

      await devService.deleteCodeById(codeId);

      responses.respondStatus204NoContent(req, res);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });