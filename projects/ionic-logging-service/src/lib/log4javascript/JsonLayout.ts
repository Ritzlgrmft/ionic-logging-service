import { Constants } from "./Constants";
import { Layout } from "./Layout";
import { LoggingEvent } from "./LoggingEvent";
import { Utilities } from "./Utilities";

export class JsonLayout extends Layout {

	public combineMessages: boolean;
	public readable: boolean;
	public batchHeader: string;
	public batchFooter: string;
	public batchSeparator: string;
	public colon: string;
	public tab: string;
	public lineBreak: string;

	constructor(readable?: boolean, combineMessages?: boolean) {
		super();

		this.readable = readable ?? false;
		this.combineMessages = combineMessages ?? true;
		this.batchHeader = this.readable ? "[" + Constants.newLine : "[";
		this.batchFooter = this.readable ? "]" + Constants.newLine : "]";
		this.batchSeparator = this.readable ? "," + Constants.newLine : ",";
		this.setKeys();
		this.colon = this.readable ? ": " : ":";
		this.tab = this.readable ? "\t" : "";
		this.lineBreak = this.readable ? Constants.newLine : "";
	}

	public isReadable(): boolean {
		return this.readable;
	}

	public isCombinedMessages(): boolean {
		return this.combineMessages;
	}

	public format(loggingEvent: LoggingEvent): string {
		const layout = this;
		const dataValues = this.getDataValues(loggingEvent, this.combineMessages);
		let str = "{" + this.lineBreak;

		for (let i = 0, len = dataValues.length - 1; i <= len; i++) {
			str += this.tab + "\"" + dataValues[i][0] + "\"" + this.colon + this.formatValue(dataValues[i][1], this.tab, true);
			if (i < len) {
				str += ",";
			}
			str += this.lineBreak;
		}

		str += "}" + this.lineBreak;
		return str;
	};

	public ignoresThrowable() {
		return false;
	};

	public toString(): string {
		return "JsonLayout";
	}

	public getContentType(): string {
		return "application/json";
	}

	private formatValue(val: any, prefix: string, expand: boolean) {
		// Check the type of the data value to decide whether quotation marks
		// or expansion are required
		let formattedValue: string;
		const valType = typeof val;
		if (val instanceof Date) {
			formattedValue = String(val.getTime());
		} else if (expand && (val instanceof Array)) {
			formattedValue = "[" + this.lineBreak;
			for (let i = 0, len = val.length; i < len; i++) {
				const childPrefix = prefix + this.tab;
				formattedValue += childPrefix + this.formatValue(val[i], childPrefix, false);
				if (i < val.length - 1) {
					formattedValue += ",";
				}
				formattedValue += this.lineBreak;
			}
			formattedValue += prefix + "]";
		} else if (valType !== "number" && valType !== "boolean") {
			formattedValue = "\"" + this.escapeNewLines(Utilities.toStr(val).replace(/\"/g, "\\\"")) + "\"";
		} else {
			formattedValue = val;
		}
		return formattedValue;
	}

	private escapeNewLines(str: string): string {
		return str.replace(/\r\n|\r|\n/g, "\\r\\n");
	}
}
