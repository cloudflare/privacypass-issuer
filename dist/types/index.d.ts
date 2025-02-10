/// <reference types="@cloudflare/workers-types" />
import { Bindings } from './bindings';
import { Context } from './context';
import { WorkerEntrypoint } from 'cloudflare:workers';
export declare class IssuerHandler extends WorkerEntrypoint<Bindings> {
    handleTokenRequest: (ctx: Context, request: Request) => Promise<Response>;
    handleHeadTokenDirectory: (ctx: Context, request: Request) => Promise<Response>;
    handleTokenDirectory: (ctx: Context, request: Request) => Promise<Response>;
    handleRotateKey: (ctx: Context, _request?: Request) => Promise<Response>;
    handleClearKey: (ctx: Context, _request?: Request) => Promise<Response>;
}
declare const _default: {
    fetch(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response>;
    scheduled(event: ScheduledEvent, env: Bindings, ectx: ExecutionContext): Promise<void>;
};
export default _default;
