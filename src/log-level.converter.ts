import * as log4javascript from "log4javascript";

import { LogLevel } from "./log-level.model";

export class LogLevelConverter {

	public static levelFromLog4Javascript(level: log4javascript.Level): LogLevel {
		switch (level) {
			case log4javascript.Level.ALL:
				return LogLevel.ALL;
			case log4javascript.Level.DEBUG:
				return LogLevel.DEBUG;
			case log4javascript.Level.ERROR:
				return LogLevel.ERROR;
			case log4javascript.Level.FATAL:
				return LogLevel.FATAL;
			case log4javascript.Level.INFO:
				return LogLevel.INFO;
			case log4javascript.Level.OFF:
				return LogLevel.OFF;
			case log4javascript.Level.TRACE:
				return LogLevel.TRACE;
			case log4javascript.Level.WARN:
				return LogLevel.WARN;
			default:
				throw new Error(`invalid level ${level}`);
		}
	}

	public static levelFromString(level: string): LogLevel {
		switch (level) {
			case "ALL":
				return LogLevel.ALL;
			case "DEBUG":
				return LogLevel.DEBUG;
			case "ERROR":
				return LogLevel.ERROR;
			case "FATAL":
				return LogLevel.FATAL;
			case "INFO":
				return LogLevel.INFO;
			case "OFF":
				return LogLevel.OFF;
			case "TRACE":
				return LogLevel.TRACE;
			case "WARN":
				return LogLevel.WARN;
			default:
				throw new Error(`invalid level ${level}`);
		}
	}

	public static levelToLog4Javascript(level: LogLevel): log4javascript.Level {
		switch (level) {
			case LogLevel.ALL:
				return log4javascript.Level.ALL;
			case LogLevel.DEBUG:
				return log4javascript.Level.DEBUG;
			case LogLevel.ERROR:
				return log4javascript.Level.ERROR;
			case LogLevel.FATAL:
				return log4javascript.Level.FATAL;
			case LogLevel.INFO:
				return log4javascript.Level.INFO;
			case LogLevel.OFF:
				return log4javascript.Level.OFF;
			case LogLevel.TRACE:
				return log4javascript.Level.TRACE;
			case LogLevel.WARN:
				return log4javascript.Level.WARN;
			default:
				throw new Error(`invalid level ${level}`);
		}
	}
}
