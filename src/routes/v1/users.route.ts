import express, { Request, Response } from "express";
import { body, param, query, validationResult } from "express-validator";
import { EnvironmentConfig } from "../../configs/environment.config";
import { UserCreateRequest } from '../../dataobjects/rest/request/userCreate.request';
import { UserUpdateRequest } from "../../dataobjects/rest/request/userUpdate.request";
import { UserVerifyRequest } from "../../dataobjects/rest/request/userVerify.request";
import * as responses from "../../services/helper/responses";
import * as userService from "../../services/user.service";
import * as logger from "../../services/helper/logger";

export const usersRouterV1 = express.Router();

usersRouterV1.get(
  "/verification",
  query("username").matches(EnvironmentConfig.REGEX_USERNAME),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const username = req.query.username as string;

      await userService.requestEmailVerification(username);

      responses.respondStatus204NoContent(req, res);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

usersRouterV1.post(
  "/verification",
  body("username").matches(EnvironmentConfig.REGEX_USERNAME),
  body("code").isLength({ min: 6, max: 6 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const requestBody = req.body as UserVerifyRequest;

      await userService.submitEmailVerification(requestBody);

      responses.respondStatus204NoContent(req, res);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

usersRouterV1.post(
  "",
  body("username").matches(EnvironmentConfig.REGEX_USERNAME),
  body("password").matches(EnvironmentConfig.REGEX_PASSWORD),
  body("first_name").matches(EnvironmentConfig.REGEX_FIRST_NAME),
  body("last_name").matches(EnvironmentConfig.REGEX_LAST_NAME),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }
    
    try {
      const requestBody = req.body as UserCreateRequest;

      const responseBody = await userService.create(requestBody);

      responses.respondStatus201Created(req, res, responseBody);
    } catch (e: any) {
      logger.error("Create User crashed", e);
      
      responses.errorHandler(req, res, e);
    }
  });

usersRouterV1.get(
  "",
  query("username").optional().matches(EnvironmentConfig.REGEX_USERNAME),
  query("first_name").optional().matches(EnvironmentConfig.REGEX_FIRST_NAME),
  query("last_name").optional().matches(EnvironmentConfig.REGEX_LAST_NAME),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const searchParameters: UserSearchParameters = {
        username: req.query.username as string,
        firstName: req.query.first_name as string,
        lastName: req.query.last_name as string
      }

      const responseBody = await userService.search(searchParameters);

      responses.respondStatus200OK(req, res, responseBody);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

usersRouterV1.get(
  "/:userId",
  param("userId").isString().isAlphanumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const userId = req.params.userId as string;
      
      const responseBody = await userService.getOneById(userId);

      responses.respondStatus200OK(req, res, responseBody);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

usersRouterV1.put(
  "/:userId",
  body("first_name").matches(EnvironmentConfig.REGEX_FIRST_NAME),
  body("last_name").matches(EnvironmentConfig.REGEX_LAST_NAME),
  body("verified").isBoolean(),
  param("userId").isString().isAlphanumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const userId = req.params.userId as string;
      const requestBody = req.body as UserUpdateRequest;

      await userService.updateById(userId, requestBody);

      responses.respondStatus204NoContent(req, res);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

usersRouterV1.delete(
  "/:userId",
  param("userId").isString().isAlphanumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const userId = req.params.userId as string;

      await userService.deleteById(userId);

      responses.respondStatus204NoContent(req, res);
    } catch (e: any) {
      
      responses.errorHandler(req, res, e);
    }
  });