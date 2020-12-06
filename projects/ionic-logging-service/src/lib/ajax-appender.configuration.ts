/**
 * Configuration for AjaxAppender.
 */
export interface AjaxAppenderConfiguration {

	/**
	 * Url to send JavaScript logs
	 */
	url: string;

	/**
	 * Specifies whether cookies should be sent with each request.
	 *
	 * Default: false.
	 */
	withCredentials?: boolean;

	/**
	 * Number of log messages sent in each request.
	 *
	 * Default: 1.
	 */
	batchSize?: number;

	/**
	 * Interval for sending log messages (in milliseconds).
	 *
	 * If set to 0, every message will be sent immediatedly.
	 *
	 * Default: 0.
	 */
	timerInterval?: number;

	/**
	 * Threshold.
	 *
	 * Valid values are: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN
	 *
	 * Default: WARN.
	 */
	threshold?: string;
}
