import express, { Request, Response } from "express";
import { param, validationResult } from "express-validator";
import { FileMissingError } from "../../dataobjects/helper/errors";
import { ProfileUpdateRequest } from "../../dataobjects/rest/request/profileUpdate.request";
import * as responses from "../../services/helper/responses";
import * as profileService from "../../services/profile.service";

export const profilesRouterV1 = express.Router({
  mergeParams: true
});

profilesRouterV1.post("/profile",
  param("userId").isString().isAlphanumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const userId = req.params.userId as string;

      const responseBody = await profileService.createProfile(userId);

      responses.respondStatus201Created(req, res, responseBody);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

profilesRouterV1.get("/profile",
  param("userId").isString().isAlphanumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const userId = req.params.userId as string;

      const responseBody = await profileService.getOneByUserId(userId);

      responses.respondStatus200OK(req, res, responseBody);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

profilesRouterV1.patch("/profile",
  param("userId").isString().isAlphanumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const userId = req.params.userId as string;
      const body = req.body as ProfileUpdateRequest;

      await profileService.updateByUserId(userId, body);

      responses.respondStatus204NoContent(req, res);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

profilesRouterV1.delete(
  "/profile",
  param("userId").isString().isAlphanumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const userId = req.params.userId as string;

      await profileService.deleteByUserId(userId);

      responses.respondStatus204NoContent(req, res);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

profilesRouterV1.put("/profile/avatar",
  param("userId").isString().isAlphanumeric(),
  async (req: any, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const userId = req.params.userId as string;

      if (!req.files || !req.files.avatar) {
        const error = new FileMissingError("Avatar missing");
        
        responses.respondStatus400BadRequest(req, res, error);
      }

      const avatar: any = req.files.avatar;

      await profileService.updateAvatarByUserId(userId, avatar);

      responses.respondStatus204NoContent(req, res);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });

profilesRouterV1.delete("/profile/avatar",
  param("userId").isString().isAlphanumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responses.respondStatus400BadRequest(req, res, { validation_errors: errors.array() })

      return;
    }

    try {
      const userId = req.params.userId as string;

      await profileService.deleteAvatarByUserId(userId);

      responses.respondStatus204NoContent(req, res);
    } catch (e: any) {
      responses.errorHandler(req, res, e);
    }
  });