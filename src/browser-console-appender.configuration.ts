/**
 * Configuration for BrowserConsoleAppender.
 */
export interface BrowserConsoleAppenderConfiguration {
	/**
	 * Threshold.
	 *
	 * Valid values are: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN
	 *
	 * Default: DEBUG.
	 */
	threshold?: string;
}
