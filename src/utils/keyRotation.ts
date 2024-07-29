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
	const options = {
		currentDate: date.toISOString(),
		tz: 'UTC',
	};

	const interval = cronParser.parseExpression(cronString, options);
	const prevDate = interval.prev().toDate();
	const nextDate = interval.next().toDate();

	// Set milliseconds to 0 to round to the nearest second
	date.setUTCMilliseconds(0);

	const result = date.getTime() === prevDate.getTime() || date.getTime() === nextDate.getTime();
	return result;
}
