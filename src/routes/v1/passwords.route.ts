import express, { Request, Response } from "express";
import { body, query, validationResult } from "express-validator";
import { EnvironmentConfig } from "../../configs/environment.config";
import { PasswordChangeRequest } from "../../dataobjects/rest/request/passwordChange.request";
import * as responses from "../../services/helper/responses";
import * as passwordService from "../../services/password.service";

export const passwordsRouterV1 = express.Router({
  mergeParams: true
});

passwordsRouterV1.get(
  "/reset",
  query("username").matches(EnvironmentConfig.REGEX_USERNAME),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const username = req.query.username as string;

      await passwordService.passwordReset(username);

      responses.respondStatus204NoContent(req, res);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

passwordsRouterV1.post(
  "/reset",
  body("username").matches(EnvironmentConfig.REGEX_USERNAME),
  body("code").isLength({ min: 6, max: 6 }),
  body("password").matches(EnvironmentConfig.REGEX_PASSWORD),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const requestBody = req.body as PasswordChangeRequest;

      await passwordService.passwordChange(requestBody);

      responses.respondStatus204NoContent(req, res);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });