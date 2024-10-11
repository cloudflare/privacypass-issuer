import { Bindings } from '../bindings';
import cronParser from 'cron-parser';
import { Context } from '../context';
import { PrevRotationTimeError } from '../errors';

interface CronParseResult {
	prevTime?: number;
	nextTime?: number;
	match: boolean;
}

const KEY_LIFESPAN = 48 * 60 * 60 * 1000;

export function getPrevRotationTime(mostRecentKeyUploadTime: Date, ctx: Context): number {
	let effectivePrevTime: number;
	if (ctx.env.ROTATION_CRON_STRING) {
		const { prevTime } = matchCronTime(ctx.env.ROTATION_CRON_STRING, mostRecentKeyUploadTime);

		if (prevTime === undefined) {
			console.error('Failed to determine previous rotation time for key');
			throw new PrevRotationTimeError('Failed to determine previous rotation time');
		}

		effectivePrevTime = Math.max(prevTime, mostRecentKeyUploadTime.getTime());
	} else {
		effectivePrevTime = mostRecentKeyUploadTime.getTime();
	}
	return effectivePrevTime;
}

export function shouldRotateKey(date: Date, env: Bindings): boolean {
	const utcDate = new Date(date.toISOString());
	return env.ROTATION_CRON_STRING ? matchCronTime(env.ROTATION_CRON_STRING, utcDate).match : false;
}

export function shouldClearKey(keyUploadTime: Date, now: Date, effectivePrevTime: number): boolean {
	const keyExpirationTime = keyUploadTime.getTime() + KEY_LIFESPAN;
	const rotationBasedExpirationTime = effectivePrevTime + KEY_LIFESPAN;
	return now.getTime() >= Math.max(keyExpirationTime, rotationBasedExpirationTime);
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
