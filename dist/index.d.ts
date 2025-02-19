/// <reference types="@cloudflare/workers-types" />
import { Bindings } from './bindings';
import { Context } from './context';
import { WorkerEntrypoint } from 'cloudflare:workers';
import { IssuerResponse } from './types';
export declare const handleTokenRequest: (ctx: Context, request: Request) => Promise<Response>;
export declare const handleHeadTokenDirectory: (ctx: Context, request: Request) => Promise<Response>;
export declare class IssuerService extends WorkerEntrypoint<Bindings> {
    tokenDirectory(request: Request, prefix: string): Promise<IssuerResponse>;
}
export declare const handleTokenDirectoryTest2: (ctx: Context, request: Request, isRCP?: boolean) => Promise<Response | IssuerResponse>;
export declare const handleTokenDirectory: (ctx: Context, request: Request) => Promise<Response>;
export declare const handleRotateKey: (ctx: Context, _request?: Request) => Promise<Response>;
export declare const handleClearKey: (ctx: Context, _request?: Request) => Promise<Response>;
export declare class IssuerHandler extends WorkerEntrypoint<Bindings> {
    fetch(request: Request): Promise<Response>;
    add(a: number, b: number): Promise<number>;
}
declare const _default: {
    fetch(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response>;
    scheduled(event: ScheduledEvent, env: Bindings, ectx: ExecutionContext): Promise<void>;
};
export default _default;
export { Router } from './router';
export { Context } from './context';
export { Bindings } from './bindings';
