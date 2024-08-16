import { json } from "body-parser";
import RequestWithRawBody from "./requestWithRawBody.interface";
import { Response } from "express";

export function rawBodyMiddleware() {
    return json({
        verify: (request: RequestWithRawBody, response: Response, buffer: Buffer) => {
            if (request.url === '/webhook' && Buffer.isBuffer(buffer)) {
                request.rawBody = Buffer.from(buffer)
            }
            return true;
        }
    })
}