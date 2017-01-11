import * as log4javascript from "log4javascript";

import { LogLevel } from "./log-level.model";
import { LogLevelConverter } from "./log-level.converter";
import { LogMessage } from "./log-message.model";

export class LocalStorageAppender extends log4javascript.Appender {
	public maxLogMessagesLength: number;

	private localStorageKey: string;
	private logMessages: LogMessage[];

	private static maxLogMessagesLengthDefault = 250;

	constructor(localStorageKey: string) {
		super();

		this.localStorageKey = localStorageKey;
		if (!localStorage.getItem(this.localStorageKey)) {
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

	public append(loggingEvent: log4javascript.LoggingEvent): void {
		// if logMessages is already full, remove oldest element
		while (this.logMessages.length >= this.maxLogMessagesLength) {
			this.logMessages.shift();
		}
		// add event to logMessages
		const message: LogMessage = {
			timeStamp: loggingEvent.timeStamp,
			level: LogLevel[LogLevelConverter.levelFromLog4Javascript(loggingEvent.level)],
			logger: loggingEvent.logger ? loggingEvent.logger.name : undefined,
			methodName: loggingEvent.messages[0],
			message: loggingEvent.messages.slice(1)
		};
		this.logMessages.push(message);

		// write values to localStorage
		localStorage.setItem(this.localStorageKey, JSON.stringify(this.logMessages));
	}

	public toString(): string {
		return "Ionic.Logging.LocalStorageAppender";
	}

	public getLogMessages(): LogMessage[] {
		return this.logMessages;
	}

	public clearLog(): void {
		this.logMessages = [];
		localStorage.removeItem(this.localStorageKey);
	}
}