import { EventEmitter } from "@angular/core";

import * as log4javascript from "log4javascript";

import { AjaxAppenderConfiguration } from "./ajax-appender.configuration";
import { JsonLayout } from "./json-layout.model";
import { LogLevelConverter } from "./log-level.converter";

/**
 * An appender which sends the log messages to a server via HTTP.
 *
 * A typical configuration could be:
 *
 * ```json
 * {
 *   "url": "https://my.backend.xy/LoggingBackend",
 *   "batchSize": 10,
 *   "timerInterval": 60000,
 *   "threshold": "INFO"
 * }
 * ```
 */
export class AjaxAppender extends log4javascript.Appender {

	private static batchSizeDefault = 1;
	private static timerIntervalDefault = 0;
	private static thresholdDefault = "WARN";

	/**
	 * Event triggered when the appender could not send log messages to the server.
	 * @param message error message
	 */
	public appenderFailed: EventEmitter<string>;

	private ajaxAppender: log4javascript.AjaxAppender;
	private url: string;

	/**
	 * Creates a new instance of the appender.
	 * @param configuration configuration for the appender.
	 */
	constructor(configuration: AjaxAppenderConfiguration) {
		super();

		if (!configuration) {
			throw new Error("configuration must be not empty");
		}
		if (!configuration.url) {
			throw new Error("url must be not empty");
		}
		this.ajaxAppender = new log4javascript.AjaxAppender(configuration.url);
		this.url = configuration.url;

		this.ajaxAppender.setLayout(new JsonLayout(false, false));
		this.ajaxAppender.addHeader("Content-Type", "application/json; charset=utf-8");
		this.ajaxAppender.setSendAllOnUnload(true);

		this.appenderFailed = new EventEmitter<string>();
		this.ajaxAppender.setFailCallback((message: any) => {
			this.appenderFailed.emit(message);
		});

		// process remaining configuration
		this.configure({
			batchSize: configuration.batchSize || AjaxAppender.batchSizeDefault,
			threshold: configuration.threshold || AjaxAppender.thresholdDefault,
			timerInterval: configuration.timerInterval || AjaxAppender.timerIntervalDefault,
			url: configuration.url,
		});

	}

	/**
	 * Configures the logging depending on the given configuration.
	 *
	 * Only the defined properties get overwritten.
	 * The url cannot be modified.
	 *
	 * @param configuration configuration data.
	 */
	public configure(configuration: AjaxAppenderConfiguration): void {
		if (configuration) {
			if (configuration.url && configuration.url !== this.url) {
				throw new Error("url must not be changed");
			}
			if (configuration.batchSize) {
				this.setBatchSize(configuration.batchSize);
			}
			if (typeof configuration.timerInterval === "number") {
				this.setTimerInterval(configuration.timerInterval);
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
		this.ajaxAppender.append(loggingEvent);
	}

	/**
	 * Gets the appender's name.
	 * Mainly for unit testing purposes.
	 * @return appender's name
	 */
	public toString(): string {
		return "Ionic.Logging.AjaxAppender";
	}

	/**
	 * Get the internally used appender.
	 * Mainly for unit testing purposes.
	 */
	public getInternalAppender(): log4javascript.AjaxAppender {
		return this.ajaxAppender;
	}

	/**
	 * Returns the number of log messages sent in each request.
	 */
	public getBatchSize(): number {
		return this.ajaxAppender.getBatchSize();
	}

	/**
	 * Sets the number of log messages to send in each request.
	 * @param batchSize new batch size
	 */
	public setBatchSize(batchSize: number): void {
		this.ajaxAppender.setBatchSize(batchSize);
	}

	/**
	 * Returns the appender's layout.
	 */
	public getLayout(): log4javascript.Layout {
		return this.ajaxAppender.getLayout();
	}

	/**
	 * Sets the appender's layout.
	 */
	public setLayout(layout: log4javascript.Layout): void {
		this.ajaxAppender.setLayout(layout);
	}

	/**
	 * Returns the length of time in milliseconds between each sending of queued log messages.
	 */
	public getTimerInterval(): number {
		return this.ajaxAppender.getTimerInterval();
	}

	/**
	 * Sets the length of time in milliseconds between each sending of queued log messages.
	 * @param timerInterval new timer interval
	 */
	public setTimerInterval(timerInterval: number): void {
		this.ajaxAppender.setTimed(timerInterval > 0);
		this.ajaxAppender.setTimerInterval(timerInterval);
	}
}
