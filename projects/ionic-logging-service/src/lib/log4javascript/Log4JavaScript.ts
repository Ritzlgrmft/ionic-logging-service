import { LogLog } from "./LogLog";

export class Log4JavaScript {

	private static enabled = true;
	private static useTimeStampsInMilliseconds = true;
	private static showStackTraces = false;
	private static applicationStartDate: Date;

	private static _initialize = (() => {
		Log4JavaScript.applicationStartDate = new Date();
	})();

	public static setEnabled(enabled: boolean) {
		Log4JavaScript.enabled = enabled;
	}

	public static isEnabled() {
		return Log4JavaScript.enabled;
	}

	public static setTimeStampsInMilliseconds(timeStampsInMilliseconds: boolean) {
		Log4JavaScript.useTimeStampsInMilliseconds = timeStampsInMilliseconds;
	}

	public static isTimeStampsInMilliseconds() {
		return Log4JavaScript.useTimeStampsInMilliseconds;
	}

	public static setShowStackTraces(show: boolean) {
		Log4JavaScript.showStackTraces = show;
	};

	public static isShowStackTraces(): boolean {
		return Log4JavaScript.showStackTraces;
	}

	public static handleError(message: string, exception?: any) {
		LogLog.error(message, exception);
		// TODO: log4javascript.dispatchEvent("error", { "message": message, "exception": exception });
	}

	public static getApplicationStartDate(): Date {
		return Log4JavaScript.applicationStartDate;
	}

}
