import { Constants } from "./Constants";
import { Layout } from "./Layout";
import { Log4JavaScript } from "./Log4JavaScript";
import { LoggingEvent } from "./LoggingEvent";
import { SimpleDateFormat } from "./SimpleDateFormat";
import { Utilities } from "./Utilities";

export class PatternLayout extends Layout {

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static readonly TTCC_CONVERSION_PATTERN = "%r %p %c - %m%n";
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static readonly DEFAULT_CONVERSION_PATTERN = "%m%n";
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static readonly ISO8601_DATEFORMAT = "yyyy-MM-dd HH:mm:ss,SSS";
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static readonly DATETIME_DATEFORMAT = "dd MMM yyyy HH:mm:ss,SSS";
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static readonly ABSOLUTETIME_DATEFORMAT = "HH:mm:ss,SSS";

	private pattern: string;

	constructor(pattern?: string) {
		super();

		this.pattern = pattern ?? PatternLayout.DEFAULT_CONVERSION_PATTERN;
	}

	public format(loggingEvent: LoggingEvent): string {
		const regex = /%(-?[0-9]+)?(\.?[0-9]+)?([acdfmMnpr%])(\{([^\}]+)\})?|([^%]+)/;
		let formattedString = "";
		let result: RegExpExecArray | null;
		let searchString = this.pattern;

		// Cannot use regex global flag since it doesn't work with exec in IE5
		while ((result = regex.exec(searchString))) {
			const matchedString = result[0];
			const padding = result[1];
			const truncation = result[2];
			const conversionCharacter = result[3];
			const specifier = result[5];
			const text = result[6];

			// Check if the pattern matched was just normal text
			if (text) {
				formattedString += "" + text;
			} else {
				// Create a raw replacement string based on the conversion
				// character and specifier
				let replacement = "";
				switch (conversionCharacter) {
					case "a": // Array of messages
					case "m": // Message
						let depth = 0;
						if (specifier) {
							depth = parseInt(specifier, 10);
							if (isNaN(depth)) {
								Log4JavaScript.handleError("PatternLayout.format: invalid specifier '" +
									specifier + "' for conversion character '" + conversionCharacter +
									"' - should be a number");
								depth = 0;
							}
						}
						const messages = (conversionCharacter === "a") ? loggingEvent.messages[0] : loggingEvent.messages;
						for (let i = 0, len = messages.length; i < len; i++) {
							if (i > 0 && (replacement.charAt(replacement.length - 1) !== " ")) {
								replacement += " ";
							}
							if (depth === 0) {
								replacement += messages[i];
							} else {
								replacement += Utilities.formatObjectExpansion(messages[i], depth);
							}
						}
						break;
					case "c": // Logger name
						const loggerName = loggingEvent.logger.name;
						if (specifier) {
							const precision = parseInt(specifier, 10);
							const loggerNameBits = loggingEvent.logger.name.split(".");
							if (precision >= loggerNameBits.length) {
								replacement = loggerName;
							} else {
								replacement = loggerNameBits.slice(loggerNameBits.length - precision).join(".");
							}
						} else {
							replacement = loggerName;
						}
						break;
					case "d": // Date
						let dateFormat = PatternLayout.ISO8601_DATEFORMAT;
						if (specifier) {
							dateFormat = specifier;
							// Pick up special cases
							if (dateFormat === "ISO8601") {
								dateFormat = PatternLayout.ISO8601_DATEFORMAT;
							} else if (dateFormat === "ABSOLUTE") {
								dateFormat = PatternLayout.ABSOLUTETIME_DATEFORMAT;
							} else if (dateFormat === "DATE") {
								dateFormat = PatternLayout.DATETIME_DATEFORMAT;
							}
						}
						// Format the date
						replacement = (new SimpleDateFormat(dateFormat)).format(loggingEvent.timeStamp);
						break;
					case "f": // Custom field
						if (this.hasCustomFields()) {
							let fieldIndex = 0;
							if (specifier) {
								fieldIndex = parseInt(specifier, 10);
								if (isNaN(fieldIndex)) {
									Log4JavaScript.handleError("PatternLayout.format: invalid specifier '" +
										specifier + "' for conversion character 'f' - should be a number");
								} else if (fieldIndex === 0) {
									Log4JavaScript.handleError("PatternLayout.format: invalid specifier '" +
										specifier + "' for conversion character 'f' - must be greater than zero");
								} else if (fieldIndex > this.customFields.length) {
									Log4JavaScript.handleError("PatternLayout.format: invalid specifier '" +
										specifier + "' for conversion character 'f' - there aren't that many custom fields");
								} else {
									fieldIndex = fieldIndex - 1;
								}
							}
							let val = super.customFields[fieldIndex].value;
							if (typeof val == "function") {
								val = val(this, loggingEvent);
							}
							replacement = val;
						}
						break;
					case "n": // New line
						replacement = Constants.newLine;
						break;
					case "p": // Level
						replacement = loggingEvent.level.name;
						break;
					case "r": // Milliseconds since log4javascript startup
						replacement = "" + (loggingEvent.timeStamp.getTime() - Log4JavaScript.getApplicationStartDate().getTime());
						break;
					case "%": // Literal % sign
						replacement = "%";
						break;
					default:
						replacement = matchedString;
						break;
				}
				// Format the replacement according to any padding or
				// truncation specified
				let l: number;

				// First, truncation
				if (truncation) {
					l = parseInt(truncation.substr(1), 10);
					const strLen = replacement.length;
					if (l < strLen) {
						replacement = replacement.substring(strLen - l, strLen);
					}
				}
				// Next, padding
				if (padding) {
					if (padding.charAt(0) === "-") {
						l = parseInt(padding.substr(1), 10);
						// Right pad with spaces
						while (replacement.length < l) {
							replacement += " ";
						}
					} else {
						l = parseInt(padding, 10);
						// Left pad with spaces
						while (replacement.length < l) {
							replacement = " " + replacement;
						}
					}
				}
				formattedString += replacement;
			}
			searchString = searchString.substr(result.index + result[0].length);
		}
		return formattedString;
	}

	public ignoresThrowable(): boolean {
		return true;
	}

	public toString(): string {
		return "PatternLayout";
	}
}
