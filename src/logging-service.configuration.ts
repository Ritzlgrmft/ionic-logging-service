import { AjaxAppenderConfiguration } from "./ajax-appender.configuration";
import { LocalStorageAppenderConfiguration } from "./local-storage-appender.configuration";
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
	ajaxAppender?: AjaxAppenderConfiguration;

	/**
	 * Settings for LocalStorageAppender.
	 */
	localStorageAppender?: LocalStorageAppenderConfiguration;

	/**
	 * Settings for MemoryAppender.
	 */
	memoryAppender?: MemoryAppenderConfiguration;
}
