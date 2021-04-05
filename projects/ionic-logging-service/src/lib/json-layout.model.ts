import * as log4javascript from "log4javascript";
import { LoggingEvent } from "log4javascript";

/**
 * Formats a logging event into JavaScript Object Notation (JSON).
 * The implemenatation is mainly the same as with log4javascript.JsonLayout,
 * with an improvement of serializing messages containing '\"'."
 */
export class JsonLayout extends log4javascript.JsonLayout {

	/**
	 * Formats the log message.
	 */
	public format(loggingEvent: LoggingEvent): string {
		const eventObj = {
			logger: loggingEvent.logger.name,
			timestamp: loggingEvent.timeStampInMilliseconds,
			level: loggingEvent.level.toString(),
			url: window.location.href,
			message: this.isCombinedMessages() ? loggingEvent.getCombinedMessages() : loggingEvent.messages
		};
		return JSON.stringify(eventObj);
	}

	/**
	 * Gets the layout's name.
	 * Mainly for unit testing purposes.
	 *
	 * @return layout's name
	 */
	public toString(): string {
		return "Ionic.Logging.JsonLayout";
	}
}
