/**
 * Logging levels.
 */
export enum LogLevel {
	/**
	 * All events should be logged.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	ALL,

	/**
	 * A fine-grained debug message, typically capturing the flow through the application.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	TRACE,

	/**
	 * A general debugging event.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	DEBUG,

	/**
	 * An event for informational purposes.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	INFO,

	/**
	 * An event that might possible lead to an error.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	WARN,

	/**
	 * An error in the application, possibly recoverable.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	ERROR,

	/**
	 * A severe error that will prevent the application from continuing.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	FATAL,

	/**
	 * No events will be logged.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	OFF,
}
