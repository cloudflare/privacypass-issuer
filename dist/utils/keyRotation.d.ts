import { Bindings } from '../bindings';
interface CronParseResult {
    prevTime?: number;
    nextTime?: number;
    match: boolean;
}
export declare function shouldRotateKey(date: Date, env: Bindings): boolean;
export declare function shouldClearKey(keyNotBefore: Date, lifespanInMs: number): boolean;
export declare function matchCronTime(cronString: string, date: Date): CronParseResult;
export {};
