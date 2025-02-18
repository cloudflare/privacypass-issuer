/// <reference types="@cloudflare/workers-types" />
import { Bindings } from './bindings';
import { Context } from './context';
export declare const HttpMethod: {
    readonly DELETE: "DELETE";
    readonly GET: "GET";
    readonly HEAD: "HEAD";
    readonly POST: "POST";
    readonly PUT: "PUT";
};
export type ExportedHandlerFetchHandler = (ctx: Context, request: Request) => Response | Promise<Response>;
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];
export declare class Router {
    private handlers;
    private validPaths;
    constructor(validPaths: Set<string>);
    private normalisePath;
    private registerMethod;
    delete(path: string, handler: ExportedHandlerFetchHandler): Router;
    get(path: string, handler: ExportedHandlerFetchHandler): Router;
    head(path: string, handler: ExportedHandlerFetchHandler): Router;
    post(path: string, handler: ExportedHandlerFetchHandler): Router;
    put(path: string, handler: ExportedHandlerFetchHandler): Router;
    private buildContext;
    private postProcessing;
    handle(request: Request<Bindings, IncomingRequestCfProperties<unknown>>, env: Bindings, ectx: ExecutionContext): Promise<Response>;
}
