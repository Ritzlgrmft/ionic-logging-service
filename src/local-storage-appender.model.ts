import * as log4javascript from "log4javascript";

import { LogLevel } from "./log-level.model";
import { LogLevelConverter } from "./log-level.converter";
import { LogMessage } from "./log-message.model";

/**
 * An appender which stores the log messages in the browser's local storage.
 * The messages are saved JSON-serialized.
 * You have to configure which key is used for storing the messages.
 */
export class LocalStorageAppender extends log4javascript.Appender {

	/**
	 * Maximum number of messages which will be stored in local storage.
	 */
	public maxLogMessagesLength: number;

	// tslint:disable-next-line:completed-docs
	private localStorageKey: string;
	// tslint:disable-next-line:completed-docs
	private logMessages: LogMessage[];

	// tslint:disable-next-line:completed-docs
	private static maxLogMessagesLengthDefault = 250;

	/**
	 * Creates a new instance of the appender.
	 * @param localStorageKey key used for storing the messages in local storage.
	 */
	constructor(localStorageKey: string) {
		super();

		// tslint:disable-next-line:no-null-keyword
		if (localStorageKey === undefined || localStorageKey === null || localStorageKey === "") {
			throw new Error("localStorageKey may be not empty");
		}

		this.localStorageKey = localStorageKey;
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
		this.setThreshold(log4javascript.Level.WARN);
		this.maxLogMessagesLength = LocalStorageAppender.maxLogMessagesLengthDefault;
	}

	/**
	 * Appender-specific method to append a log message.
	 * @param loggingEvent event to be appended.
	 */
	public append(loggingEvent: log4javascript.LoggingEvent): void {
		// if logMessages is already full, remove oldest element
		while (this.logMessages.length >= this.maxLogMessagesLength) {
			this.logMessages.shift();
		}
		// add event to logMessages
		const message: LogMessage = {
			timeStamp: loggingEvent.timeStamp,
			level: LogLevel[LogLevelConverter.levelFromLog4Javascript(loggingEvent.level)],
			logger: typeof loggingEvent.logger !== "undefined" ? loggingEvent.logger.name : undefined,
			methodName: loggingEvent.messages[0],
			message: loggingEvent.messages.slice(1)
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