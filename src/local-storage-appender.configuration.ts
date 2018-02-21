/**
 * Configuration for LocalStorageAppender.
 */
export interface LocalStorageAppenderConfiguration {
	/**
	 * Key which is used to store the messages in the local storage.
	 */
	localStorageKey: string;

	/**
	 * Maximum number of log messages stored by the appender.
	 *
	 * Default: 250.
	 */
	maxMessages?: number;

	/**
	 * Threshold.
	 *
	 * Valid values are: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN
	 * Default: WARN.
	 */
	threshold?: string;
}
