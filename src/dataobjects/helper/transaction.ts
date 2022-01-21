import { Request, Response } from "express";
import { Header } from "./header";

interface AppRequest {
    method: string;
    url: string;
    headers?: Header[];
    body?: any;
}

interface AppResponse {
    body?: any;
    http_status: number;
    headers: Header[];
}

export class Transaction {
    private static id: string;
    private static request: AppRequest;
    private static response: AppResponse;

    static make(req: Request, res: Response, status: number, transactionId: string, body?: any): Transaction {
        const requestHeaders: Header[] = [];
        for (const [key, value] of Object.entries(req.headers)) {
            requestHeaders.push({ name: key, value: value ? value.toString() : "" })
        }

        const responseHeaders: Header[] = [];
        for (const [key, value] of Object.entries(res.getHeaders())) {
            responseHeaders.push({ name: key, value: value ? value.toString() : "" });
        }

        const appRequest: AppRequest = {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
            headers: requestHeaders
        }
        
        const appResponse: AppResponse = {
            http_status: status,
            headers: responseHeaders,
            body: body
        }

        this.id = transactionId;

        // security related - mask password
        if (appRequest.body) {
            if (appRequest.body.hasOwnProperty("password")) {
                appRequest.body.password = "********";
            }
        }

        // file buffer way too long - no need to see in full
        if (appRequest.body) {
            if (appRequest.body.hasOwnProperty("logo")) {
                appRequest.body.logo = "truncated";
            }
        }

        this.request = appRequest;
        this.response = appResponse;

        return this;
    }
}