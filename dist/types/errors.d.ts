import { Labels } from 'promjs';
import { Context } from './context';
import { JSONResponse } from './utils/jsonResponse';
export declare function handleError(ctx: Context, error: Error, labels?: Labels): Promise<JSONResponse>;
export declare class HTTPError extends Error {
    status: number;
    constructor(message?: string, status?: number);
}
export declare class MethodNotAllowedError extends HTTPError {
    static CODE: string;
    code: string;
    constructor(message?: string);
}
export declare class PageNotFoundError extends HTTPError {
    static CODE: string;
    code: string;
    constructor(message?: string);
}
export declare class HeaderNotDefinedError extends HTTPError {
    static CODE: string;
    code: string;
    constructor(message?: string);
}
export declare class InternalCacheError extends HTTPError {
    static CODE: string;
    code: string;
    constructor(message?: string);
}
export declare class NotImplementedError extends HTTPError {
    static CODE: string;
    code: string;
    constructor(message?: string);
}
export declare class UnreachableError extends HTTPError {
    static CODE: string;
    code: string;
    constructor(message?: string);
}
export declare class InvalidTokenTypeError extends HTTPError {
    static CODE: string;
    code: string;
    constructor(message?: string);
}
export declare class BadTokenKeyRequestedError extends HTTPError {
    static CODE: string;
    code: string;
    constructor(message?: string);
}
