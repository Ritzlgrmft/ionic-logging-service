import { Appender } from "./Appender";
import { Constants } from "./Constants";
import { Log4JavaScript } from "./Log4JavaScript";
import { LoggingEvent } from "./LoggingEvent";
import { LogLog } from "./LogLog";
import { Utilities } from "./Utilities";

export class Logger {

	public static readonly anonymousLoggerName = "[anonymous]";
	public static readonly defaultLoggerName = "[default]";
	public static readonly nullLoggerName = "[null]";
	public static readonly rootLoggerName = "root";

	public name: string;

	private parent: Logger | null = null;
	private children: Logger[] = [];
	private additive = true;
	private appenders: Appender[];
	private loggerLevel: Level | null;
	private isRoot: boolean;
	private isNull: boolean;
	private appenderCache: Appender[] | null;
	private appenderCacheInvalidated: boolean;
	private timers = {};

	constructor(name: string) {
		this.name = name;
		this.parent = null;
		this.children = [];

		this.appenders = [];
		this.loggerLevel = null;
		this.isRoot = (this.name === Logger.rootLoggerName);
		this.isNull = (this.name === Logger.nullLoggerName);

		this.appenderCache = null;
		this.appenderCacheInvalidated = false;
	}

	public addChild(childLogger: Logger) {
		this.children.push(childLogger);
		childLogger.parent = this;
		childLogger.invalidateAppenderCache();
	};

	// Additivity
	public getAdditivity() {
		return this.additive;
	}

	public setAdditivity(additivity: boolean) {
		const valueChanged = (this.additive !== additivity);
		this.additive = additivity;
		if (valueChanged) {
			this.invalidateAppenderCache();
		}
	}

	// Create methods that use the appenders variable in this scope
	public addAppender(appender: Appender) {
		if (this.isNull) {
			Log4JavaScript.handleError("Logger.addAppender: you may not add an appender to the null logger");
		} else {
			if (appender instanceof Appender) {
				if (!this.appenders.includes(appender)) {
					this.appenders.push(appender);
					appender.setAddedToLogger(this);
					this.invalidateAppenderCache();
				}
			} else {
				Log4JavaScript.handleError("Logger.addAppender: appender supplied ('" +
					Utilities.toStr(appender) + "') is not a subclass of Appender");
			}
		}
	};

	public removeAppender(appender: Appender) {
		const index = this.appenders.indexOf(appender);
		if (index >= 0) {
			this.appenders.splice(index, 1);
		}
		appender.setRemovedFromLogger(this);
		this.invalidateAppenderCache();
	};

	public removeAllAppenders() {
		const appenderCount = this.appenders.length;
		if (appenderCount > 0) {
			for (let i = 0; i < appenderCount; i++) {
				this.appenders[i].setRemovedFromLogger(this);
			}
			this.appenders.length = 0;
			this.invalidateAppenderCache();
		}
	};

	public getEffectiveAppenders(): Appender[] {
		if (this.appenderCache === null || this.appenderCacheInvalidated) {
			// Build appender cache
			const parentEffectiveAppenders = (this.isRoot || !this.getAdditivity() || this.parent === null) ?
				[] : this.parent.getEffectiveAppenders();
			this.appenderCache = (parentEffectiveAppenders ?? []).concat(this.appenders);
			this.appenderCacheInvalidated = false;
		}
		return this.appenderCache;
	};

	public invalidateAppenderCache(): void {
		this.appenderCacheInvalidated = true;
		for (let i = 0, len = this.children.length; i < len; i++) {
			this.children[i].invalidateAppenderCache();
		}
	};

	public log(level: Level, ...params: any[]) {
		if (Log4JavaScript.isEnabled() && level.isGreaterOrEqual(this.getEffectiveLevel())) {
			// Check whether last param is an exception
			let exception;
			let finalParamIndex = params.length - 1;
			const lastParam = params[finalParamIndex];
			if (params.length > 1 && Utilities.isError(lastParam)) {
				exception = lastParam;
				finalParamIndex--;
			}

			// Construct genuine array for the params
			const messages = [];
			for (let i = 0; i <= finalParamIndex; i++) {
				messages[i] = params[i];
			}

			const loggingEvent = new LoggingEvent(
				this, new Date(), level, messages, exception);

			this.callAppenders(loggingEvent);
		}
	};

	public callAppenders(loggingEvent: LoggingEvent) {
		const effectiveAppenders = this.getEffectiveAppenders();
		for (let i = 0, len = effectiveAppenders.length; i < len; i++) {
			effectiveAppenders[i].doAppend(loggingEvent);
		}
	};

	public setLevel(level: Level) {
		// Having a level of null on the root logger would be very bad.
		if (this.isRoot && level === null) {
			Log4JavaScript.handleError("Logger.setLevel: you cannot set the level of the root logger to null");
		} else if (level instanceof Level) {
			this.loggerLevel = level;
		} else {
			Log4JavaScript.handleError("Logger.setLevel: level supplied to logger " +
				this.name + " is not an instance of log4javascript.Level");
		}
	};

	public getLevel(): Level | null {
		return this.loggerLevel;
	};

	public getEffectiveLevel(): Level {
		for (let logger: Logger | null = this; logger !== null; logger = logger.parent) {
			const level = logger.getLevel();
			if (level !== null) {
				return level;
			}
		}
		return Level.OFF;
	};

	// public group(name: string, initiallyExpanded: boolean) {
	// 	if (Log4JavaScript.isEnabled()) {
	// 		const effectiveAppenders = this.getEffectiveAppenders();
	// 		for (let i = 0, len = effectiveAppenders?.length; i < len; i++) {
	// 			effectiveAppenders[i].group(name, initiallyExpanded);
	// 		}
	// 	}
	// };

	// public groupEnd() {
	// 	if (Log4JavaScript.isEnabled()) {
	// 		const effectiveAppenders = this.getEffectiveAppenders();
	// 		for (let i = 0, len = effectiveAppenders.length; i < len; i++) {
	// 			effectiveAppenders[i].groupEnd();
	// 		}
	// 	}
	// }

	// public time(name: string, level: Level): void {
	// 	if (Log4JavaScript.isEnabled()) {
	// 		if (isUndefined(name)) {
	// 			Log4JavaScript.handleError("Logger.time: a name for the timer must be supplied");
	// 		} else if (level && !(level instanceof Level)) {
	// 			Log4JavaScript.handleError("Logger.time: level supplied to timer " +
	// 				name + " is not an instance of log4javascript.Level");
	// 		} else {
	// 			timers[name] = new Timer(name, level);
	// 		}
	// 	}
	// }

	// public timeEnd(name: string): void {
	// 	if (Log4JavaScript.isEnabled()) {
	// 		if (isUndefined(name)) {
	// 			Log4JavaScript.handleError("Logger.timeEnd: a name for the timer must be supplied");
	// 		} else if (timers[name]) {
	// 			const timer = timers[name];
	// 			const milliseconds = timer.getElapsedTime();
	// 			this.log(timer.level, ["Timer " + Utilities.toStr(name) + " completed in " + milliseconds + "ms"]);
	// 			delete timers[name];
	// 		} else {
	// 			LogLog.warn("Logger.timeEnd: no timer found with name " + name);
	// 		}
	// 	}
	// }

	public assert(expr: any) {
		if (Log4JavaScript.isEnabled() && !expr) {
			let args = [];
			for (let i = 1, len = arguments.length; i < len; i++) {
				args.push(arguments[i]);
			}
			args = (args.length > 0) ? args : ["Assertion Failure"];
			args.push(Constants.newLine);
			args.push(expr);
			this.log(Level.ERROR, args);
		}
	};

	public toString(): string {
		return "Logger[" + this.name + "]";
	}

	public trace() {
		this.log(Level.TRACE, arguments);
	}

	public debug() {
		this.log(Level.DEBUG, arguments);
	}

	public info() {
		this.log(Level.INFO, arguments);
	}

	public warn() {
		this.log(Level.WARN, arguments);
	}

	public error() {
		this.log(Level.ERROR, arguments);
	}

	public fatal() {
		this.log(Level.FATAL, arguments);
	}

	public isEnabledFor(level: Level): boolean {
		return level.isGreaterOrEqual(this.getEffectiveLevel());
	}

	public isTraceEnabled(): boolean {
		return this.isEnabledFor(Level.TRACE);
	}

	public isDebugEnabled(): boolean {
		return this.isEnabledFor(Level.DEBUG);
	}

	public isInfoEnabled(): boolean {
		return this.isEnabledFor(Level.INFO);
	}

	public isWarnEnabled(): boolean {
		return this.isEnabledFor(Level.WARN);
	}

	public isErrorEnabled(): boolean {
		return this.isEnabledFor(Level.ERROR);
	}

	public isFatalEnabled(): boolean {
		return this.isEnabledFor(Level.FATAL);
	}
}
