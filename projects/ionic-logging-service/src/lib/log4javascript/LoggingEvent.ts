import { Constants } from "./Constants";
import { Logger } from "./Logger";
import { Utilities } from "./Utilities";

export class LoggingEvent {

	public timeStampInMilliseconds: number;
	public timeStampInSeconds: number;
	public level: Level;
	public logger: Logger;
	public timeStamp: Date;
	public messages: string[];
	public milliseconds: any;
	public exception: any;

	constructor(logger: any, timeStamp: Date, level: Level, messages: string[],
		exception: any) {
		this.logger = logger;
		this.timeStamp = timeStamp;
		this.timeStampInMilliseconds = timeStamp.getTime();
		this.timeStampInSeconds = Math.floor(this.timeStampInMilliseconds / 1000);
		this.milliseconds = this.timeStamp.getMilliseconds();
		this.level = level;
		this.messages = messages;
		this.exception = exception;
	}

	public getThrowableStrRep() {
		return this.exception ?
			Utilities.getExceptionStringRep(this.exception) : "";
	}

	public getCombinedMessages() {
		return (this.messages.length === 1) ? this.messages[0] :
			this.messages.join(Constants.newLine);
	}

	public toString(): string {
		return "LoggingEvent[" + this.level + "]";
	}
}
