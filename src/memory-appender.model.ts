import * as log4javascript from "log4javascript";

import { LogLevel } from "./log-level.model";
import { LogLevelConverter } from "./log-level.converter";
import { LogMessage } from "./log-message.model";

export class MemoryAppender extends log4javascript.Appender {

	public maxLogMessagesLength: number;
	public isInsertAtTop: boolean;

	private logMessages: LogMessage[];
	private onLogMessagesChangedCallback: (message: LogMessage) => void;

	constructor() {
		super();
		this.logMessages = [];
		this.maxLogMessagesLength = 100;
		this.isInsertAtTop = false;
	}

	public append(loggingEvent: log4javascript.LoggingEvent): void {
		// if logMessages is already full, remove oldest element
		while (this.logMessages.length >= this.maxLogMessagesLength) {
			if (this.isInsertAtTop) {
				this.logMessages.pop();
			} else {
				this.logMessages.shift();
			}
		}
		// add event to logMessages
		const message: LogMessage = {
			timeStamp: loggingEvent.timeStamp,
			level: LogLevel[LogLevelConverter.levelFromLog4Javascript(loggingEvent.level)],
			logger: loggingEvent.logger ? loggingEvent.logger.name : undefined,
			methodName: loggingEvent.messages[0],
			message: loggingEvent.messages.slice(1)
		};
		if (this.isInsertAtTop) {
			this.logMessages.unshift(message);
		} else {
			this.logMessages.push(message);
		}

		// inform about new message
		if (typeof this.onLogMessagesChangedCallback === "function") {
			this.onLogMessagesChangedCallback(message);
		}
	}

	public toString(): string {
		return "Ionic.Logging.MemoryAppender";
	}

	public getLogMessages(): LogMessage[] {
		return this.logMessages;
	}

	public setOnLogMessagesChangedCallback(callback: (message: LogMessage) => void): void {
		this.onLogMessagesChangedCallback = callback;
	}
}
