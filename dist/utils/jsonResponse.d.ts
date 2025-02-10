/// <reference types="@cloudflare/workers-types" />
import { Context } from '../context';
export declare class JSONResponse extends Response {
    constructor(body: unknown, init?: ResponseInit);
}
export type StandardResponse = {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string | null;
};
export type MyResponse = {
    status: number;
    message: string;
    headers: Record<string, string>;
    body: string | null;
};
export declare class ResponseFactory {
    static createResponse(res: StandardResponse, cache?: boolean, ctx?: Context, isRCP?: boolean): Promise<Response | StandardResponse>;
}
