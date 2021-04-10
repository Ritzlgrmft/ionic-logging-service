import { LoggingEvent } from "./LoggingEvent";
import { Utilities } from "./Utilities";

export abstract class Layout {

	protected customFields: { name: string; value: string | ((layout: Layout, loggingEvent: LoggingEvent) => string) }[] = [];

	private defaults = {
		loggerKey: "logger",
		timeStampKey: "timestamp",
		millisecondsKey: "milliseconds",
		levelKey: "level",
		messageKey: "message",
		exceptionKey: "exception",
		urlKey: "url"
	};

	private loggerKey = "logger";
	private timeStampKey = "timestamp";
	private millisecondsKey = "milliseconds";
	private levelKey = "level";
	private messageKey = "message";
	private exceptionKey = "exception";
	private urlKey = "url";
	// batchHeader: "",
	// batchFooter: "",
	// batchSeparator: "",
	// returnsPostData: false,
	private overrideTimeStampsSetting = false;
	private useTimeStampsInMilliseconds: boolean | null = null;

	public getContentType(): string {
		return "text/plain";
	}

	public allowBatching(): boolean {
		return true;
	}

	public setTimeStampsInMilliseconds(timeStampsInMilliseconds: boolean) {
		this.overrideTimeStampsSetting = true;
		this.useTimeStampsInMilliseconds = timeStampsInMilliseconds;
	}

	public isTimeStampsInMilliseconds() {
		return this.overrideTimeStampsSetting ?
			this.useTimeStampsInMilliseconds : this.useTimeStampsInMilliseconds;
	}

	public getTimeStampValue(loggingEvent: LoggingEvent) {
		return this.isTimeStampsInMilliseconds() ?
			loggingEvent.timeStampInMilliseconds : loggingEvent.timeStampInSeconds;
	}

	public getDataValues(loggingEvent: LoggingEvent, combineMessages: boolean) {
		const dataValues = [
			[this.loggerKey, loggingEvent.logger.name],
			[this.timeStampKey, this.getTimeStampValue(loggingEvent)],
			[this.levelKey, loggingEvent.level.name],
			[this.urlKey, window.location.href],
			[this.messageKey, combineMessages ? loggingEvent.getCombinedMessages() : loggingEvent.messages]
		];
		if (!this.isTimeStampsInMilliseconds()) {
			dataValues.push([this.millisecondsKey, loggingEvent.milliseconds]);
		}
		if (loggingEvent.exception) {
			dataValues.push([this.exceptionKey, Utilities.getExceptionStringRep(loggingEvent.exception)]);
		}
		if (this.hasCustomFields()) {
			for (let i = 0, len = this.customFields.length; i < len; i++) {
				let val = this.customFields[i].value;

				// Check if the value is a function. If so, execute it, passing it the
				// current layout and the logging event
				if (typeof val === "function") {
					val = val(this, loggingEvent);
				}
				dataValues.push([this.customFields[i].name, val]);
			}
		}
		return dataValues;
	}

	public setKeys(loggerKey?: string, timeStampKey?: string, levelKey?: string, messageKey?: string,
		exceptionKey?: string, urlKey?: string, millisecondsKey?: string) {
		this.loggerKey = loggerKey ?? this.defaults.loggerKey;
		this.timeStampKey = timeStampKey ?? this.defaults.timeStampKey;
		this.levelKey = levelKey ?? this.defaults.levelKey;
		this.messageKey = messageKey ?? this.defaults.messageKey;
		this.exceptionKey = exceptionKey ?? this.defaults.exceptionKey;
		this.urlKey = urlKey ?? this.defaults.urlKey;
		this.millisecondsKey = millisecondsKey ?? this.defaults.millisecondsKey;
	}

	public setCustomField(name: string, value: string | ((layout: Layout, loggingEvent: LoggingEvent) => string)) {
		let fieldUpdated = false;
		for (let i = 0, len = this.customFields.length; i < len; i++) {
			if (this.customFields[i].name === name) {
				this.customFields[i].value = value;
				fieldUpdated = true;
			}
		}
		if (!fieldUpdated) {
			this.customFields.push({ name, value });
		}
	}

	public hasCustomFields() {
		return (this.customFields.length > 0);
	}

	public formatWithException(loggingEvent: LoggingEvent) {
		let formatted = this.format(loggingEvent);
		if (loggingEvent.exception && this.ignoresThrowable()) {
			formatted += loggingEvent.getThrowableStrRep();
		}
		return formatted;
	}

	public abstract format(loggingEvent: LoggingEvent): string;

	public abstract ignoresThrowable(): boolean;

	public abstract toString(): string;
}
