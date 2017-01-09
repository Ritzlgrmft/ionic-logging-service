/**
 * Partial configuration definition for LoggingService
 */
export interface LoggingConfiguration {

	/**
	 * Log levels for different loggers.
	 * Default: root: WARN
	 */
	logLevels?: {
		/**
		 * Logger name or "root" for root logger.
		 */
		loggerName: string;

		/**
		 * Log level.
		 * Valid values are: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN
		 */
		logLevel: string;
	}[];

	/**
	 * Settings for AjaxAppender.
	 */
	ajaxAppender?: {
		/**
		 * Url to send JavaScript logs
		 */
		url: string;

		/**
		 * Interval for sending log messages.
		 * If set to 0, every message will be sent immediatedly.
		 * Default: 0.
		 */
		timerInterval?: number;

		/**
		 * Log level.
		 * Valid values are: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN
		 * Default: ALL.
		 */
		logLevel?: string;
	};

	/**
	 * Settings for LocalStorageAppender.
	 */
	localStorageAppender?: {
		/**
		 * Key which is used to store the messages in the local storage.
		 */
		localStorageKey: string;

		/**
		 * Log level.
		 * Valid values are: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN
		 * Default: WARN.
		 */
		logLevel?: string;

		/**
		 * Maximum number of log messages stored by the appender.	
		 */
		maxMessages?: number;
	};
}
