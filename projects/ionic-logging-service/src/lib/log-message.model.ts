export interface LogMessage {
	timeStamp: Date;
	level: string;
	logger: string;
	methodName: string;
	message: string[];
}
