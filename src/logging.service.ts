import { EventEmitter, Injectable } from "@angular/core";

import { ConfigurationService } from "ionic-configuration-service";

import * as log4javascript from "log4javascript";

import { LocalStorageAppender } from "./local-storage-appender.model";
import { LogLevelConverter } from "./log-level.converter";
import { LogMessage } from "./log-message.model";
import { Logger } from "./logger.model";
import { LoggingConfiguration } from "./logging-configuration.model";
import { MemoryAppender } from "./memory-appender.model";

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
		this.memoryAppender.setOnLogMessagesChangedCallback((message) => {
			this.logMessagesChanged.emit(message);
		});
		logger.addAppender(this.memoryAppender);

		this.configure();
	}

	/**
	 * Configures the logging depending on the given configuration.
	 * @param configuration configuration data.
	 * If the parameter is skipped, the configuration data will be taken from configuration service, key "logging"
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
			if (typeof configuration.ajaxAppender.threshold !== "undefined") {
				try {
					ajaxAppender.setThreshold(
						LogLevelConverter.levelToLog4Javascript(
							LogLevelConverter.levelFromString(configuration.ajaxAppender.threshold)));
				} catch (e) {
					throw new Error(`invalid threshold ${configuration.ajaxAppender.threshold}`);
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
			if (typeof configuration.ajaxAppender.batchSize !== "undefined") {
				ajaxAppender.setBatchSize(configuration.ajaxAppender.batchSize);
			}
			ajaxAppender.setFailCallback((message: any) => {
				this.ajaxAppenderFailed.emit(message);
			});
			log4javascript.getRootLogger().addAppender(ajaxAppender);
		}

		// configure LocalStorageAppender
		if (typeof configuration.localStorageAppender !== "undefined") {
			const localStorageAppender = new LocalStorageAppender(configuration.localStorageAppender.localStorageKey);
			if (typeof configuration.localStorageAppender.threshold !== "undefined") {
				try {
					localStorageAppender.setThreshold(
						LogLevelConverter.levelToLog4Javascript(
							LogLevelConverter.levelFromString(configuration.localStorageAppender.threshold)));
				} catch (e) {
					throw new Error(`invalid threshold ${configuration.localStorageAppender.threshold}`);
				}
			}
			localStorageAppender.setLayout(new log4javascript.PatternLayout("%d{HH:mm:ss,SSS} %c %m"));
			if (configuration.localStorageAppender.maxMessages > 0) {
				localStorageAppender.setMaxMessages(configuration.localStorageAppender.maxMessages);
			}
			log4javascript.getRootLogger().addAppender(localStorageAppender);
		}

		// configure MemoryAppender
		if (typeof configuration.memoryAppender !== "undefined") {
			if (configuration.memoryAppender.maxMessages > 0) {
				this.memoryAppender.setMaxMessages(configuration.memoryAppender.maxMessages);
			}
		}
	}

	/**
	 * Gets the root logger from which all other loggers derive.
	 * @return root logger
	 */
	public getRootLogger(): Logger {
		return new Logger();
	}

	/**
	 * Gets a logger with the specified name, creating it if a logger with that name does not already exist.
	 * @param loggerName name of the logger
	 * @return logger
	 */
	public getLogger(loggerName: string): Logger {
		return new Logger(loggerName);
	}

	/**
	 * Gets the last log messages.
	 *
	 * The log messages are retrieved from the internal [MemoryAppender](../memoryappender.html).
	 * That means you will get only the most current messages. The number of the messages is limited
	 * by its maxMessages value.
	 * @return log messages
	 */
	public getLogMessages(): LogMessage[] {
		return this.memoryAppender.getLogMessages();
	}
}
