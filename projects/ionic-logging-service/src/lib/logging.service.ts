﻿import { EventEmitter, Injectable, Optional } from "@angular/core";

import { AjaxAppender } from "./ajax-appender.model";
import { LocalStorageAppender } from "./local-storage-appender.model";
import { LogLevelConverter } from "./log-level.converter";
import { LogMessage } from "./log-message.model";
import { Log4JavaScript } from "./log4javascript/Log4JavaScript";
import { LogLog } from "./log4javascript/LogLog";
import { PatternLayout } from "./log4javascript/PatternLayout";
import { Logger } from "./logger.model";
import { LoggingServiceConfiguration } from "./logging-service.configuration";
import { MemoryAppender } from "./memory-appender.model";

/**
 * Service for logging functionality.
 *
 * By default, the following settings are used:
 *  - logger: root with level WARN
 *  - appender: BrowserConsoleAppender with threshold DEBUG and MemoryAppender with threshold ALL
 *
 * Via [configure](#configure), it is possible to amend these settings.
 */
@Injectable({
	providedIn: "root"
})
export class LoggingService {

	/**
	 * Event triggered when the log messages got (potentially) change.
	 * This can happen when:
	 * - new message was added
	 * - all message where removed from memory
	 * - all massages where removed for one spcific LocalStorageAppender
	 */
	public logMessagesChanged: EventEmitter<void>;

	/**
	 * Event triggered when ajax appender could not send log messages to the server.
	 *
	 * @param message error message
	 */
	public ajaxAppenderFailed: EventEmitter<string>;

	private memoryAppender: MemoryAppender;
	private browserConsoleAppender: BrowserConsoleAppender;

	/**
	 * Creates a new instance of the service.
	 */
	constructor() {

		// prevent log4javascript to show alerts on case of errors
		LogLog.setQuietMode(true);

		// create event emitter
		this.logMessagesChanged = new EventEmitter<void>();
		this.ajaxAppenderFailed = new EventEmitter<string>();

		// configure appender
		const logger = Log4JavaScript.getRootLogger();
		logger.setLevel(log4javascript.Level.WARN);

		// browser console appender for debugger
		this.browserConsoleAppender = new BrowserConsoleAppender();
		this.browserConsoleAppender.setLayout(new PatternLayout("%d{HH:mm:ss,SSS} %c %m"));
		this.browserConsoleAppender.setThreshold(log4javascript.Level.ALL);
		logger.addAppender(this.browserConsoleAppender);

		// in-memory appender for display on log messages page
		this.memoryAppender = new MemoryAppender();
		this.memoryAppender.setLayout(new PatternLayout("%d{HH:mm:ss,SSS} %c %m"));
		this.memoryAppender.setOnLogMessagesChangedCallback((message) => {
			this.logMessagesChanged.emit();
		});
		logger.addAppender(this.memoryAppender);

		this.configure();
	}

	/**
	 * Configures the logging depending on the given configuration.
	 *
	 * @param configuration configuration data.
	 */
	public configure(configuration?: LoggingServiceConfiguration): void {

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
			const ajaxAppender = new AjaxAppender(configuration.ajaxAppender);
			ajaxAppender.appenderFailed.subscribe((message: string) => {
				this.ajaxAppenderFailed.emit(message);
			});
			log4javascript.getRootLogger().addAppender(ajaxAppender);
		}

		// configure LocalStorageAppender
		if (typeof configuration.localStorageAppender !== "undefined") {
			const localStorageAppender = new LocalStorageAppender(configuration.localStorageAppender);
			log4javascript.getRootLogger().addAppender(localStorageAppender);

			// ensure that an eventual memoryAppender is behind the localStorageAppender
			const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
			const memoryAppender = appenders.find((a) => a.toString() === "Ionic.Logging.MemoryAppender") as MemoryAppender;
			if (memoryAppender) {
				log4javascript.getRootLogger().removeAppender(memoryAppender);
				log4javascript.getRootLogger().addAppender(memoryAppender);
			}
		}

		// configure MemoryAppender
		if (configuration.memoryAppender) {
			this.memoryAppender.configure(configuration.memoryAppender);
		}

		// configure BrowserConsoleAppender
		if (configuration.browserConsoleAppender) {
			if (configuration.browserConsoleAppender.threshold) {
				const convertedThreshold = LogLevelConverter.levelToLog4Javascript(
					LogLevelConverter.levelFromString(configuration.browserConsoleAppender.threshold));
				this.browserConsoleAppender.setThreshold(convertedThreshold);
			}
		}

	}

	/**
	 * Gets the root logger from which all other loggers derive.
	 *
	 * @return root logger
	 */
	public getRootLogger(): Logger {
		return new Logger();
	}

	/**
	 * Gets a logger with the specified name, creating it if a logger with that name does not already exist.
	 *
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
	 *
	 * @return log messages
	 */
	public getLogMessages(): LogMessage[] {
		return this.memoryAppender.getLogMessages();
	}

	/**
	 * Loads the log messages written by the LocalStorageAppender with the given key.
	 *
	 * @param localStorageKey key for the local storage
	 * @returns log messages
	 */
	public getLogMessagesFromLocalStorage(localStorageKey: string): LogMessage[] {
		return LocalStorageAppender.loadLogMessages(localStorageKey);
	}

	/**
	 * Remove all log messages.
	 */
	public removeLogMessages(): void {
		this.memoryAppender.removeLogMessages();
		this.logMessagesChanged.emit();
	}

	/**
	 * Removes the log messages written by the LocalStorageAppender with the given key.
	 *
	 * @param localStorageKey key for the local storage
	 */
	public removeLogMessagesFromLocalStorage(localStorageKey: string): void {
		LocalStorageAppender.removeLogMessages(localStorageKey);
		this.logMessagesChanged.emit();
	}
}
