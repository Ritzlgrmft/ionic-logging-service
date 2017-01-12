import * as log4javascript from "log4javascript";

import { LogLevel } from "./log-level.model";
import { LogLevelConverter } from "./log-level.converter";

/**
 * Logger for writing log messages.
 */
export class Logger {

	// tslint:disable-next-line:completed-docs
	private logger: log4javascript.Logger;

	constructor(logger?: string | any) {
		if (typeof logger === "undefined") {
			this.logger = log4javascript.getRootLogger();
		} else if (typeof logger === "string") {
			this.logger = log4javascript.getLogger(logger);
		} else {
			this.logger = logger;
		}
	}

	/**
	 * Sets the log level.
	 */
	public setLogLevel(level: LogLevel): void {
		this.logger.setLevel(LogLevelConverter.levelToLog4Javascript(level));
	}

	/**
	 * Logs a message at level DEBUG.
	 *
	 * @param methodName name of the method 
	 * @param params optional parameters to be logged; objects will be formatted as JSON
	 */
	public debug(methodName: string, ...params: any[]): void {
		if (this.logger.isDebugEnabled()) {
			const args = [methodName];
			for (const param of params) {
				args.push(this.formatArgument(param));
			}
			this.logger.debug.apply(this.logger, args);
		}
	}

	/**
	 * Logs a message at level INFO.
	 *
	 * @param methodName name of the method 
	 * @param params optional parameters to be logged; objects will be formatted as JSON
	 */
	public info(methodName: string, ...params: any[]): void {
		if (this.logger.isInfoEnabled()) {
			const args = [methodName];
			for (const param of params) {
				args.push(this.formatArgument(param));
			}
			this.logger.info.apply(this.logger, args);
		}
	}

	/**
	 * Logs a message at level WARN.
	 *
	 * @param methodName name of the method 
	 * @param params optional parameters to be logged; objects will be formatted as JSON
	 */
	public warn(methodName: string, ...params: any[]): void {
		if (this.logger.isWarnEnabled()) {
			const args = [methodName];
			for (const param of params) {
				args.push(this.formatArgument(param));
			}
			this.logger.warn.apply(this.logger, args);
		}
	}

	/**
	 * Logs a message at level ERROR.
	 *
	 * @param methodName name of the method 
	 * @param params optional parameters to be logged; objects will be formatted as JSON
	 */
	public error(methodName: string, ...params: any[]): void {
		if (this.logger.isErrorEnabled()) {
			const args = [methodName];
			for (const param of params) {
				args.push(this.formatArgument(param));
			}
			this.logger.error.apply(this.logger, args);
		}
	}

	/**
	 * Logs the entry into a method.
	 * The method name will be logged at level INFO, the parameters at level DEBUG.
	 *
	 * @param methodName name of the method 
	 * @param params optional parameters to be logged; objects will be formatted as JSON
	 */
	public entry(methodName: string, ...params: any[]): void {
		if (this.logger.isInfoEnabled()) {
			const args = [methodName, "entry"];
			if (this.logger.isDebugEnabled()) {
				for (const param of params) {
					args.push(this.formatArgument(param));
				}
			}
			this.logger.info.apply(this.logger, args);
		}
	}

	/**
	 * Logs the exit of a method.
	 * The method name will be logged at level INFO, the parameters at level DEBUG.
	 *
	 * @param methodName name of the method 
	 * @param params optional parameters to be logged; objects will be formatted as JSON
	 */
	public exit(methodName: string, ...params: any[]): void {
		if (this.logger.isInfoEnabled()) {
			const args = [methodName, "exit"];
			if (this.logger.isDebugEnabled()) {
				for (const param of params) {
					args.push(this.formatArgument(param));
				}
			}
			this.logger.info.apply(this.logger, args);
		}
	}

	/**
	 * Formats the given argument.
	 */
	public formatArgument(arg: any): string {
		if (typeof arg === "string") {
			return arg;
		} else if (typeof arg === "number") {
			return arg.toString();
		} else if (arg instanceof Error) {
			// JSON.stringify() returns here "{ }"
			return arg.toString();
		} else {
			try {
				return JSON.stringify(arg);
			} catch (e) {
				return e.message;
			}
		}
	}

	/**
	 * Returns the internal Logger (for unit tests only).
	 */
	public getInternalLogger(): log4javascript.Logger {
		return this.logger;
	}
}

