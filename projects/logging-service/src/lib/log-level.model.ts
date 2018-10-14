/**
 * Logging levels.
 */
export enum LogLevel {
	/**
	 * All events should be logged.
	 */
	ALL,

	/**
	 * A fine-grained debug message, typically capturing the flow through the application.
	 */
	TRACE,

	/**
	 * A general debugging event.
	 */
	DEBUG,

	/**
	 * An event for informational purposes.
	 */
	INFO,

	/**
	 * An event that might possible lead to an error.
	 */
	WARN,

	/**
	 * An error in the application, possibly recoverable.
	 */
	ERROR,

	/**
	 * A severe error that will prevent the application from continuing.
	 */
	FATAL,

	/**
	 * No events will be logged.
	 */
	OFF,
}
