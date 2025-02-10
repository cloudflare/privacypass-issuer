/// <reference types="@cloudflare/workers-types" />
import { Bindings } from './bindings';
import { Context } from './context';
import { WorkerEntrypoint } from 'cloudflare:workers';
import { MyResponse, StandardResponse } from './utils/jsonResponse';
export declare class SumService extends WorkerEntrypoint<Bindings> {
    fetch(request: Request): Promise<Response>;
    add(a: number, b: number): Promise<number>;
    handleRCPTest(ctx: Context, request: Request, isRCP?: boolean): Promise<StandardResponse>;
    handleRCPTestiResp(): Promise<MyResponse>;
}
export declare class IssuerHandler extends WorkerEntrypoint<Bindings> {
    handleTokenRequest: (ctx: Context, request: Request) => Promise<Response>;
    handleHeadTokenDirectory: (ctx: Context, request: Request) => Promise<Response>;
    handleTokenDirectory: (ctx: Context, request: Request, isRCP?: boolean) => Promise<Response>;
    handleRotateKey: (ctx: Context, _request?: Request) => Promise<Response>;
    handleClearKey: (ctx: Context, _request?: Request) => Promise<Response>;
}
declare const _default: {
    fetch(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response>;
    scheduled(event: ScheduledEvent, env: Bindings, ectx: ExecutionContext): Promise<void>;
};
export default _default;
export { Router } from './router';
export { Context } from './context';
export { Bindings } from './bindings';
