/**
 * Log message.
 */
export interface LogMessage {
	/**
	 * Time when the log was written.
	 */
	timeStamp: Date;

	/**
	 * Log level.
	 */
	level: string;

	/**
	 * Name of the logger.
	 */
	logger: string | undefined;

	/**
	 * Method, in which the message was written.
	 */
	methodName: string;

	/**
	 * Message.
	 */
	message: string[];
}
