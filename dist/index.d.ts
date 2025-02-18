/// <reference types="@cloudflare/workers-types" />
import { Bindings } from './bindings';
import { Context } from './context';
import { IssuerConfigurationResponse } from './types';
import { WorkerEntrypoint } from 'cloudflare:workers';
export declare const handleTokenRequest: (ctx: Context, request: Request) => Promise<Response>;
export declare const handleHeadTokenDirectory: (ctx: Context, request: Request) => Promise<Response>;
export declare class IssuerService extends WorkerEntrypoint<Bindings> {
    tokenDirectory(request: Request, url: string): Promise<IssuerConfigurationResponse>;
}
export declare const handleTokenDirectoryRCP: (request: Request) => IssuerConfigurationResponse;
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
