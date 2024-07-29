import { Bindings } from '../bindings';
import cronParser from 'cron-parser';

export function shouldRotateKey(date: Date, env: Bindings): boolean {
	console.log("checking if key needs to be rotated")
	const utcDate = new Date(date.toISOString());

	console.log(`the rotation schedule is ${env.ROTATION_CRON_STRING}`)
	if (env.ROTATION_CRON_STRING) {
		const result = matchCronTime(env.ROTATION_CRON_STRING, utcDate);
		console.log(`the result of matching against the cron timer is ${result}`)
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
