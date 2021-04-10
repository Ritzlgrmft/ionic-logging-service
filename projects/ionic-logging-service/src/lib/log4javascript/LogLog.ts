import { Constants } from "./Constants";
import { Utilities } from "./Utilities";

/**
 * Simple logging for log4javascript itself.
 */
export class LogLog {

	private static quietMode = false;

	private static debugMessages: string[] = [];

	private static numberOfErrors = 0;

	private static alertAllErrors = false;

	public static setQuietMode(quietMode: boolean): void {
		this.quietMode = quietMode;
	}

	public static setAlertAllErrors(alertAllErrors: boolean) {
		this.alertAllErrors = alertAllErrors;
	}

	public static debug(message: string): void {
		this.debugMessages.push(message);
	}

	public static displayDebug(): void {
		alert(this.debugMessages.join(Constants.newLine));
	}

	public static warn(message: string, exception?: any) {
		console.warn(message + exception ? ": " + exception : "");
	}

	public static error(message: string, exception: any) {
		if (++this.numberOfErrors === 1 || this.alertAllErrors) {
			if (!this.quietMode) {
				let alertMessage = "log4javascript error: " + message;
				if (exception) {
					alertMessage += Constants.newLine + Constants.newLine + "Original error: " + Utilities.getExceptionStringRep(exception);
				}
				alert(alertMessage);
			}
		}
	}
}
