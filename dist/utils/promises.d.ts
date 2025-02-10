import { Labels } from 'promjs';
import { Context } from '../context';
export declare const DEFAULT_RETRIES = 2;
export declare function asyncRetries<A extends unknown[], T>(ctx: Context, f: (...args: A) => Promise<T>, retries?: number, labels?: Labels): (...args: A) => Promise<T>;
