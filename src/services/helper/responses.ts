import { Request, Response } from "express";
import { Header } from "../../dataobjects/helper/header";
import { Transaction } from '../../dataobjects/helper/transaction';
import { generateUUID } from "../../services/helper/tools";
import { AlreadyExistsError, NotFoundError, ImageNotValidError, FeatureUnavailableError, FileMissingError, ExpiredError } from "../../dataobjects/helper/errors";
import { EnvironmentConfig } from "../../configs/environment.config";
import * as logger from "../../services/helper/logger";

export function errorHandler(req: Request, res: Response, error: Error, headers?: Header[]) {
    error.stack = undefined;
    if (error instanceof FileMissingError || error instanceof ExpiredError) {
        respondStatus400BadRequest(req, res, error, headers);
    } else if (error instanceof NotFoundError) {
        respondStatus404NotFound(req, res, error, headers);
    } else if (error instanceof FeatureUnavailableError) {
        respondStatus406NotAcceptable(req, res, error, headers);
    } else if (error instanceof AlreadyExistsError) {
        respondStatus409Conflict(req, res, error, headers);
    } else if (error instanceof ImageNotValidError) {
        respondStatus422UnprocessableEntity(req, res, error, headers);
    } else {
        logger.error("server crash", error);
        respondStatus500InternalServerError(req, res, headers);
    }
}

export function respondStatus200OK(req: Request, res: Response, body?: any, headers?: Header[]) {
    constructResponse(req, res, 200, body, headers);
}

export function respondStatus201Created(req: Request, res: Response, body?: any, headers?: Header[]) {
    constructResponse(req, res, 201, body, headers);
}

export function respondStatus202Accepted(req: Request, res: Response, body?: any, headers?: Header[]) {
    constructResponse(req, res, 202, body, headers);
}

export function respondStatus204NoContent(req: Request, res: Response, headers?: Header[]) {
    constructResponse(req, res, 204, headers);
}

export function respondStatus400BadRequest(req: Request, res: Response, body?: any, headers?: Header[]) {
    constructResponse(req, res, 400, body, headers);
}

export function respondStatus401Unauthorized(req: Request, res: Response, body?: any, headers?: Header[]) {
    constructResponse(req, res, 401, body, headers);
}

export function respondStatus403Forbidden(req: Request, res: Response, body?: any, headers?: Header[]) {
    constructResponse(req, res, 403, body, headers);
}

export function respondStatus404NotFound(req: Request, res: Response, body?: any, headers?: Header[]) {
    constructResponse(req, res, 404, body, headers);
}

export function respondStatus406NotAcceptable(req: Request, res: Response, body?: any, headers?: Header[]) {
    constructResponse(req, res, 406, body, headers);
}

export function respondStatus409Conflict(req: Request, res: Response, body?: any, headers?: Header[]) {
    constructResponse(req, res, 409, body, headers);
}

export function respondStatus422UnprocessableEntity(req: Request, res: Response, body?: any, headers?: Header[]) {
    constructResponse(req, res, 422, body, headers);
}

export function respondStatus500InternalServerError(req: Request, res: Response, body?: any, headers?: Header[]) {
    constructResponse(req, res, 500, body, headers);
}

function constructResponse(req: Request, res: Response, status: number, body?: any, headers?: Header[]) {
    const transactionId = generateUUID();
    
    if (!headers) {
        headers = [];
        headers.push({
            name: "Transaction-Id",
            value: transactionId
        })
    }

    headers.forEach(header => {
        res.setHeader(header.name, header.value);
    });

    // passing body here because getting it out of res.json is insanely stupid
    if (EnvironmentConfig.FLAG_LOG_TRANSACTIONS) {
        logger.info(Transaction.make(req, res, status, transactionId, body));
    }

    if (status === 500) {
        res.status(500).send({ message: "Internal Server Error"})
    }

    res.status(status).send(body);
}