/// <reference types="@cloudflare/workers-types" />
import { Bindings } from './bindings';
import { Context } from './context';
type ExportedHandlerFetchHandler = (ctx: Context, request: Request) => Response | Promise<Response>;
export declare class Router {
    private handlers;
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
export {};
