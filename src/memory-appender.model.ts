import * as log4javascript from "log4javascript";

import { LogLevelConverter } from "./log-level.converter";
import { LogLevel } from "./log-level.model";
import { LogMessage } from "./log-message.model";

/**
 * An appender which stores the log messages in the browser's memory.
 */
export class MemoryAppender extends log4javascript.Appender {

	private static maxMessagesDefault = 250;

	private maxMessages: number;

	// tslint:disable-next-line:completed-docs
	private logMessages: LogMessage[];
	// tslint:disable-next-line:completed-docs
	private onLogMessagesChangedCallback: (message: LogMessage) => void;

	/**
	 * Creates a new instance of the appender.
	 */
	constructor() {
		super();
		this.logMessages = [];
		this.maxMessages = MemoryAppender.maxMessagesDefault;
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
			logger: typeof loggingEvent.logger === "object" ? loggingEvent.logger.name : undefined,
			message: loggingEvent.messages.slice(1),
			methodName: loggingEvent.messages[0],
			timeStamp: loggingEvent.timeStamp,
		};
		this.logMessages.push(message);

		// inform about new message
		if (typeof this.onLogMessagesChangedCallback === "function") {
			this.onLogMessagesChangedCallback(message);
		}
	}

	/**
	 * Gets the appender's name.
	 * Mainly for unit testing purposes.
	 * @return appender's name
	 */
	public toString(): string {
		return "Ionic.Logging.MemoryAppender";
	}

	/**
	 * Get the maximum number of messages which will be stored in memory.
	 */
	public getMaxMessages(): number {
		return this.maxMessages;
	}

	/**
	 * Set the maximum number of messages which will be stored in memory.
	 *
	 * If the appender stores currently more messages than the new value allows, the oldest messages get removed.
	 * @param value new maximum number
	 */
	public setMaxMessages(value: number): void {
		this.maxMessages = value;

		// if there are too much logMessages for the new value, remove oldest messages
		while (this.logMessages.length > this.maxMessages) {
			this.logMessages.shift();
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
	 * Registers a callback which will be called every time a new message is appended.
	 * @param callback callback to be called
	 */
	public setOnLogMessagesChangedCallback(callback: (message: LogMessage) => void): void {
		this.onLogMessagesChangedCallback = callback;
	}
}
