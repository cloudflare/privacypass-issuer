import { Bindings } from '../bindings';
import cronParser from 'cron-parser';

interface CronParseResult {
	prevTime?: number;
	nextTime?: number;
	match: boolean;
}

export function shouldRotateKey(date: Date, env: Bindings): boolean {
	const utcDate = new Date(date.toISOString());
	return env.ROTATION_CRON_STRING ? matchCronTime(env.ROTATION_CRON_STRING, utcDate).match : false;
}

export function shouldClearKey(keyUploadTime: Date, now: Date, lifespanInMs: number): boolean {
	const keyExpirationTime = keyUploadTime.getTime() + lifespanInMs;
	return now.getTime() > keyExpirationTime;
}

export function matchCronTime(cronString: string, date: Date): CronParseResult {
	// Set seconds and milliseconds to 0 to truncate to the nearest minute
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCSeconds#parameters
	date.setUTCSeconds(0, 0);

	const options = {
		currentDate: date.toISOString(),
		tz: 'UTC',
	};

	let interval;
	try {
		interval = cronParser.parseExpression(cronString, options);
	} catch (error) {
		console.error('Error parsing cron string', error);
		return { match: false };
	}

	const prevDate = interval.prev().toDate();
	const nextDate = interval.next().toDate();

	const result = date.getTime() === prevDate.getTime() || date.getTime() === nextDate.getTime();

	return {
		prevTime: prevDate.getTime(),
		nextTime: nextDate.getTime(),
		match: result,
	};
}
