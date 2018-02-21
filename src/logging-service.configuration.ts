﻿import { LocalStorageAppenderConfiguration } from "./local-storage-appender.configuration";
import { MemoryAppenderConfiguration } from "./memory-appender.configuration";

/**
 * Partial configuration definition for LoggingService
 */
export interface LoggingServiceConfiguration {

	/**
	 * Log levels for different loggers.
	 * Default: root: WARN
	 */
	logLevels?: Array<{
		/**
		 * Logger name or "root" for root logger.
		 */
		loggerName: string;

		/**
		 * Log level.
		 * Valid values are: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN
		 */
		logLevel: string;
	}>;

	/**
	 * Settings for AjaxAppender.
	 */
	ajaxAppender?: {
		/**
		 * Url to send JavaScript logs
		 */
		url: string;

		/**
		 * Number of log messages sent in each request.
		 * Default: 1.
		 */
		batchSize?: number;

		/**
		 * Interval for sending log messages.
		 * If set to 0, every message will be sent immediatedly.
		 * Default: 0.
		 */
		timerInterval?: number;

		/**
		 * Threshold.
		 * Valid values are: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN
		 * Default: ALL.
		 */
		threshold?: string;
	};

	/**
	 * Settings for LocalStorageAppender.
	 */
	localStorageAppender?: LocalStorageAppenderConfiguration;

	/**
	 * Settings for MemoryAppender.
	 */
	memoryAppender?: MemoryAppenderConfiguration;
}
