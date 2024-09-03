import { Bindings } from '../bindings';
import cronParser from 'cron-parser';

export function shouldRotateKey(date: Date, env: Bindings): boolean {
	const utcDate = new Date(date.toISOString());

	if (env.ROTATION_CRON_STRING) {
		const result = matchCronTime(env.ROTATION_CRON_STRING, utcDate);
		return result;
	}
	return false;
}

function matchCronTime(cronString: string, date: Date): boolean {
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
		return false;
	}

	const prevDate = interval.prev().toDate();
	const nextDate = interval.next().toDate();

	const result = date.getTime() === prevDate.getTime() || date.getTime() === nextDate.getTime();
	return result;
}
