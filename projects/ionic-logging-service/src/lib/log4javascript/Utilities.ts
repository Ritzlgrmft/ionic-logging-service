import { Constants } from "./Constants";
import { Log4JavaScript } from "./Log4JavaScript";
import { LogLog } from "./LogLog";

export class Utilities {

	public static toStr(obj: any): string {
		if (obj && obj.toString) {
			return obj.toString();
		} else {
			return String(obj);
		}
	}
	public static getExceptionMessage(ex: any): string {
		if (ex.message) {
			return ex.message;
		} else if (ex.description) {
			return ex.description;
		} else {
			return Utilities.toStr(ex);
		}
	}

	/**
	 * Gets the portion of the URL after the last slash.
	 *
	 * @param url
	 * @returns
	 */
	public static getUrlFileName(url: string) {
		const lastSlashIndex = Math.max(url.lastIndexOf("/"), url.lastIndexOf("\\"));
		return url.substr(lastSlashIndex + 1);
	}

	/**
	 * Returns a nicely formatted representation of an error.
	 *
	 * @param ex
	 * @returns
	 */
	public static getExceptionStringRep(ex: any): string {
		if (ex) {
			let exStr = "Exception: " + Utilities.getExceptionMessage(ex);
			try {
				if (ex.lineNumber) {
					exStr += " on line number " + ex.lineNumber;
				}
				if (ex.fileName) {
					exStr += " in file " + Utilities.getUrlFileName(ex.fileName);
				}
			} catch (localEx) {
				LogLog.warn("Unable to obtain file and line information for error");
			}
			if (Log4JavaScript.isShowStackTraces() && ex.stack) {
				exStr += Constants.newLine + "Stack trace:" + Constants.newLine + ex.stack;
			}
			return exStr;
		}
		return "";
	}

	public static isError(err: any): boolean {
		return (err instanceof Error);
	}

	/**
	 * Ensure all line breaks are \n only
	 *
	 * @param text
	 * @returns
	 */
	public static splitIntoLines(text: string) {
		const text2 = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
		return text2.split("\n");
	}

	public static formatObjectExpansion(obj: any, depth: number, indentation?: string) {
		const objectsExpanded: any[] = [];


		return Utilities.doFormat(objectsExpanded, obj, depth, indentation);
	}

	private static doFormat(objectsExpanded: any[], obj: any, depth: number, indentation?: string) {
		let i; let len; let childDepth; let childIndentation; let childLines; let expansion;
		let childExpansion;

		if (!indentation) {
			indentation = "";
		}

		if (obj === null) {
			return "null";
		} else if (typeof obj == "undefined") {
			return "undefined";
		} else if (typeof obj == "string") {
			return Utilities.formatString(obj, indentation);
		} else if (typeof obj == "object" && objectsExpanded.indexOf(obj) >= 0) {
			try {
				expansion = Utilities.toStr(obj);
			} catch (ex) {
				expansion = "Error formatting property. Details: " + Utilities.getExceptionStringRep(ex);
			}
			return expansion + " [already expanded]";
		} else if ((obj instanceof Array) && depth > 0) {
			objectsExpanded.push(obj);
			expansion = "[" + Constants.newLine;
			childDepth = depth - 1;
			childIndentation = indentation + "  ";
			childLines = [];
			for (i = 0, len = obj.length; i < len; i++) {
				try {
					childExpansion = Utilities.doFormat(objectsExpanded, obj[i], childDepth, childIndentation);
					childLines.push(childIndentation + childExpansion);
				} catch (ex) {
					childLines.push(childIndentation + "Error formatting array member. Details: " +
						Utilities.getExceptionStringRep(ex) + "");
				}
			}
			expansion += childLines.join("," + Constants.newLine) + Constants.newLine + indentation + "]";
			return expansion;
		} else if (Object.prototype.toString.call(obj) === "[object Date]") {
			return obj.toString();
		} else if (typeof obj == "object" && depth > 0) {
			objectsExpanded.push(obj);
			expansion = "{" + Constants.newLine;
			childDepth = depth - 1;
			childIndentation = indentation + "  ";
			childLines = [];
			for (i in obj) {
				if ({}.hasOwnProperty.call(obj, i)) {
					try {
						childExpansion = Utilities.doFormat(objectsExpanded, obj[i], childDepth, childIndentation);
						childLines.push(childIndentation + i + ": " + childExpansion);
					} catch (ex) {
						childLines.push(childIndentation + i + ": Error formatting property. Details: " +
							Utilities.getExceptionStringRep(ex));
					}
				}
			}
			expansion += childLines.join("," + Constants.newLine) + Constants.newLine + indentation + "}";
			return expansion;
		} else {
			return Utilities.formatString(Utilities.toStr(obj), indentation);
		}
	}

	private static formatString(text: string, indentation: string) {
		const lines = Utilities.splitIntoLines(text);
		for (let j = 1, jLen = lines.length; j < jLen; j++) {
			lines[j] = indentation + lines[j];
		}
		return lines.join(Constants.newLine);
	}

}
