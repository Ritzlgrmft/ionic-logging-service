import { EventEmitter, Injectable } from "@angular/core";

import { ConfigurationService } from "ionic-configuration-service";

import * as log4javascript from "log4javascript";

import { Logger } from "./logger.model";
import { LoggingConfiguration } from "./logging-configuration.model";
import { LogLevelConverter } from "./log-level.converter";
import { LogMessage } from "./log-message.model";
import { MemoryAppender } from "./memory-appender.model";
import { LocalStorageAppender } from "./local-storage-appender.model";

/**
 * Service for logging functionality.
 *
 * By default, the following settings are used:
 *  - log level: WARN
 *  - appender: BrowserConsoleAppender and MemoryAppender
 *
 * Via configure(), it is possible to amend these settings. 
 */
@Injectable()
export class LoggingService {

	constructor(
		private configurationService: ConfigurationService) {

		// prevent log4javascript to show alerts on case of errors
		log4javascript.logLog.setQuietMode(true);

		// create event emitter
		this.logMessagesChanged = new EventEmitter<LogMessage>();
		this.ajaxAppenderFailed = new EventEmitter<string>();

		// configure appender
		const logger = log4javascript.getRootLogger();
		logger.setLevel(log4javascript.Level.WARN);

		// browser console appender for debugger
		const browserConsoleAppender = new log4javascript.BrowserConsoleAppender();
		browserConsoleAppender.setLayout(new log4javascript.PatternLayout("%d{HH:mm:ss,SSS} %c %m"));
		logger.addAppender(browserConsoleAppender);

		// in-memory appender for display on log messages page
		this.memoryAppender = new MemoryAppender();
		this.memoryAppender.setLayout(new log4javascript.PatternLayout("%d{HH:mm:ss,SSS} %c %m"));
		this.memoryAppender.setOnLogMessagesChangedCallback(message => {
			this.logMessagesChanged.emit(message);
		});
		logger.addAppender(this.memoryAppender);

		this.configure();
	}

	/**
	 * Event triggered when new log message was added.
	 * @param message new log message
	 */
	public logMessagesChanged: EventEmitter<LogMessage>;

	/**
	 * Event triggered when ajax appender could not send log messages to the server.
	 * @param message error message
	 */
	public ajaxAppenderFailed: EventEmitter<string>;

	// tslint:disable-next-line:completed-docs
	private memoryAppender: MemoryAppender;

	/**
	 * Configures the logging depending on the given configuration.
	 */
	public configure(configuration?: LoggingConfiguration): void {

		if (typeof configuration === "undefined") {
			configuration = this.configurationService.getValue("logging");
		}
		if (typeof configuration === "undefined") {
			configuration = {};
		}

		// set log levels
		if (typeof configuration.logLevels !== "undefined") {
			for (const level of configuration.logLevels) {
				let logger: log4javascript.Logger;
				if (level.loggerName === "root") {
					logger = log4javascript.getRootLogger();
				} else {
					logger = log4javascript.getLogger(level.loggerName);
				}
				try {
					logger.setLevel(LogLevelConverter.levelToLog4Javascript(LogLevelConverter.levelFromString(level.logLevel)));
				} catch (e) {
					throw new Error(`invalid log level ${level.logLevel}`);
				}
			}
		}

		// configure AjaxAppender
		if (typeof configuration.ajaxAppender !== "undefined") {
			const ajaxAppender = new log4javascript.AjaxAppender(configuration.ajaxAppender.url, false);
			if (typeof configuration.ajaxAppender.logLevel !== "undefined") {
				try {
					ajaxAppender.setThreshold(
						LogLevelConverter.levelToLog4Javascript(
							LogLevelConverter.levelFromString(configuration.ajaxAppender.logLevel)));
				} catch (e) {
					throw new Error(`invalid log level ${configuration.ajaxAppender.logLevel}`);
				}
			}
			ajaxAppender.setLayout(new log4javascript.JsonLayout(false, false));
			ajaxAppender.addHeader("Content-Type", "application/json; charset=utf-8");
			ajaxAppender.setSendAllOnUnload(true);
			if (configuration.ajaxAppender.timerInterval > 0) {
				ajaxAppender.setTimed(true);
				ajaxAppender.setTimerInterval(configuration.ajaxAppender.timerInterval);
			} else {
				ajaxAppender.setTimed(false);
				ajaxAppender.setTimerInterval(0);
			}
			ajaxAppender.setFailCallback(message => {
				this.ajaxAppenderFailed.emit(message);
			});
			log4javascript.getRootLogger().addAppender(ajaxAppender);
		}

		// configure LocalStorageAppender
		if (typeof configuration.localStorageAppender !== "undefined") {
			const localStorageAppender = new LocalStorageAppender(configuration.localStorageAppender.localStorageKey);
			if (typeof configuration.localStorageAppender.logLevel !== "undefined") {
				try {
					localStorageAppender.setThreshold(
						LogLevelConverter.levelToLog4Javascript(
							LogLevelConverter.levelFromString(configuration.localStorageAppender.logLevel)));
				} catch (e) {
					throw new Error(`invalid log level ${configuration.localStorageAppender.logLevel}`);
				}
			}
			localStorageAppender.setLayout(new log4javascript.PatternLayout("%d{HH:mm:ss,SSS} %c %m"));
			if (configuration.localStorageAppender.maxMessages > 0) {
				localStorageAppender.maxLogMessagesLength = configuration.localStorageAppender.maxMessages;
			}
			log4javascript.getRootLogger().addAppender(localStorageAppender);
		}
	}

	/**
	 * Returns the root logger from which all other loggers derive.
	 */
	public getRootLogger(): Logger {
		return new Logger();
	}

	/**
	 * Returns a logger with the specified name, creating it if a logger with that name does not already exist. 
	 */
	public getLogger(loggerName: string): Logger {
		return new Logger(loggerName);
	}

	/**
	 * Returns the last log messages.
	 */
	public getLogMessages(): LogMessage[] {
		return this.memoryAppender.getLogMessages();
	}
}
