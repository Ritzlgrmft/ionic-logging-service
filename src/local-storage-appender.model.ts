import * as log4javascript from "log4javascript";

import { LocalStorageAppenderConfiguration } from "./local-storage-appender.configuration";
import { LogLevelConverter } from "./log-level.converter";
import { LogLevel } from "./log-level.model";
import { LogMessage } from "./log-message.model";

/**
 * An appender which stores the log messages in the browser's local storage.
 *
 * The messages are saved JSON-serialized.
 * You have to configure which key is used for storing the messages.
 *
 * A typical configuration could be:
 *
 * ```json
 * {
 *   "localStorageKey": "myLogs",
 *   "maxMessages": 500,
 *   "threshold": "INFO"
 * }
 * ```
 */
export class LocalStorageAppender extends log4javascript.Appender {

	private static maxMessagesDefault = 250;
	private static thresholdDefault = "WARN";

	private maxMessages: number;

	// tslint:disable-next-line:completed-docs
	private localStorageKey: string;
	// tslint:disable-next-line:completed-docs
	private logMessages: LogMessage[];

	/**
	 * Creates a new instance of the appender.
	 * @param configuration configuration for the appender.
	 */
	constructor(configuration: LocalStorageAppenderConfiguration) {
		super();

		if (!configuration) {
			throw new Error("configuration must be not empty");
		}
		// tslint:disable-next-line:no-null-keyword
		if (!configuration.localStorageKey || configuration.localStorageKey === "") {
			throw new Error("localStorageKey must be not empty");
		}
		this.localStorageKey = configuration.localStorageKey;

		// read existing logMessages
		// tslint:disable-next-line:no-null-keyword
		if (localStorage.getItem(this.localStorageKey) === null) {
			this.logMessages = [];
		} else {
			this.logMessages = JSON.parse(localStorage.getItem(this.localStorageKey));
			for (const logMessage of this.logMessages) {
				// timestamps are serialized as strings
				logMessage.timeStamp = new Date(logMessage.timeStamp);
			}
		}

		// process remaining configuration
		this.configure({
			localStorageKey: configuration.localStorageKey,
			maxMessages: configuration.maxMessages || LocalStorageAppender.maxMessagesDefault,
			threshold: configuration.threshold || LocalStorageAppender.thresholdDefault,
		});
	}

	/**
	 * Configures the logging depending on the given configuration.
	 *
	 * Only the defined properties get overwritten.
	 * The localStorageKey cannot be modified.
	 *
	 * @param configuration configuration data.
	 */
	public configure(configuration: LocalStorageAppenderConfiguration): void {
		if (configuration) {
			if (configuration.localStorageKey && configuration.localStorageKey !== this.localStorageKey) {
				throw new Error("localStorageKey must not be changed");
			}
			if (configuration.maxMessages) {
				this.setMaxMessages(configuration.maxMessages);
			}
			if (configuration.threshold) {
				const convertedThreshold = LogLevelConverter.levelToLog4Javascript(
					LogLevelConverter.levelFromString(configuration.threshold));
				this.setThreshold(convertedThreshold);
			}
		}
	}

	/**
	 * Appender-specific method to append a log message.
	 * @param loggingEvent event to be appended.
	 */
	public append(loggingEvent: log4javascript.LoggingEvent): void {
		// if logMessages is already full, remove oldest element
		while (this.logMessages.length >= this.maxMessages) {
			this.logMessages.shift();
		}
		// add event to logMessages
		const message: LogMessage = {
			level: LogLevel[LogLevelConverter.levelFromLog4Javascript(loggingEvent.level)],
			logger: typeof loggingEvent.logger !== "undefined" ? loggingEvent.logger.name : undefined,
			message: loggingEvent.messages.slice(1),
			methodName: loggingEvent.messages[0],
			timeStamp: loggingEvent.timeStamp,
		};
		this.logMessages.push(message);

		// write values to localStorage
		localStorage.setItem(this.localStorageKey, JSON.stringify(this.logMessages));
	}

	/**
	 * Gets the appender's name.
	 * Mainly for unit testing purposes.
	 * @return appender's name
	 */
	public toString(): string {
		return "Ionic.Logging.LocalStorageAppender";
	}

	/**
	 * Get the key which is used to store the messages in the local storage.
	 */
	public getLocalStorageKey(): string {
		return this.localStorageKey;
	}

	/**
	 * Get the maximum number of messages which will be stored in local storage.
	 */
	public getMaxMessages(): number {
		return this.maxMessages;
	}

	/**
	 * Set the maximum number of messages which will be stored in local storage.
	 *
	 * If the appender stores currently more messages than the new value allows, the oldest messages get removed.
	 * @param value new maximum number
	 */
	public setMaxMessages(value: number): void {
		if (this.maxMessages !== value) {
			this.maxMessages = value;

			if (this.logMessages.length > this.maxMessages) {
				// there are too much logMessages for the new value, therefore remove oldest messages
				while (this.logMessages.length > this.maxMessages) {
					this.logMessages.shift();
				}

				// write values to localStorage
				localStorage.setItem(this.localStorageKey, JSON.stringify(this.logMessages));
			}
		}
	}

	/**
	 * Gets all messages stored in local storage.
	 * Mainly for unit testing purposes.
	 * @return stored messages
	 */
	public getLogMessages(): LogMessage[] {
		return this.logMessages;
	}

	/**
	 * Removes all messages from local storage.
	 * Mainly for unit testing purposes.
	 */
	public clearLog(): void {
		this.logMessages = [];
		localStorage.removeItem(this.localStorageKey);
	}
}
