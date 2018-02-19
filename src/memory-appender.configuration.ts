/**
 * Configuration for MemoryAppender.
 */
export interface MemoryAppenderConfiguration {
	/**
	 * Maximum number of log messages stored by the appender.
	 *
	 * Default: 250.
	 */
	maxMessages?: number;

	/**
	 * Threshold.
	 *
	 * Valid values are: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN.
	 * Default: ALL.
	 */
	threshold?: string;
}
