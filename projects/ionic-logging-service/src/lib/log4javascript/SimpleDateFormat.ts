/* eslint-disable @typescript-eslint/naming-convention */
export class SimpleDateFormat {

	private static readonly regex = /('[^']*')|(G+|y+|M+|w+|W+|D+|d+|F+|E+|a+|H+|k+|K+|h+|m+|s+|S+|Z+)|([a-zA-Z]+)|([^a-zA-Z']+)/;
	private static readonly monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];
	private static readonly dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	private static readonly TEXT2 = 0;
	private static readonly TEXT3 = 1;
	private static readonly NUMBER = 2;
	private static readonly YEAR = 3;
	private static readonly MONTH = 4;
	private static readonly TIMEZONE = 5;
	private static readonly types: { [key: string]: number } = {
		G: SimpleDateFormat.TEXT2,
		y: SimpleDateFormat.YEAR,
		M: SimpleDateFormat.MONTH,
		w: SimpleDateFormat.NUMBER,
		W: SimpleDateFormat.NUMBER,
		D: SimpleDateFormat.NUMBER,
		d: SimpleDateFormat.NUMBER,
		F: SimpleDateFormat.NUMBER,
		E: SimpleDateFormat.TEXT3,
		a: SimpleDateFormat.TEXT2,
		H: SimpleDateFormat.NUMBER,
		k: SimpleDateFormat.NUMBER,
		K: SimpleDateFormat.NUMBER,
		h: SimpleDateFormat.NUMBER,
		m: SimpleDateFormat.NUMBER,
		s: SimpleDateFormat.NUMBER,
		S: SimpleDateFormat.NUMBER,
		Z: SimpleDateFormat.TIMEZONE
	};

	private static readonly ONE_DAY = 24 * 60 * 60 * 1000;
	private static readonly ONE_WEEK = 7 * SimpleDateFormat.ONE_DAY;
	private static readonly DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK = 1;


	private formatString: string;
	private minimalDaysInFirstWeek: number | undefined;

	constructor(formatString: string) {
		this.formatString = formatString;
	}

	/**
	 * Sets the minimum number of days in a week in order for that week to
	 * be considered as belonging to a particular month or year
	 */
	public setMinimalDaysInFirstWeek(days: number) {
		this.minimalDaysInFirstWeek = days;
	}

	public getMinimalDaysInFirstWeek(): number {
		return this.minimalDaysInFirstWeek ?? SimpleDateFormat.DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK;
	}

	public format(date: Date): string {
		let formattedString = "";
		let result;
		let searchString = this.formatString;
		while ((result = SimpleDateFormat.regex.exec(searchString))) {
			const quotedString = result[1];
			const patternLetters = result[2];
			const otherLetters = result[3];
			const otherCharacters = result[4];

			// If the pattern matched is quoted string, output the text between the quotes
			if (quotedString) {
				if (quotedString === "''") {
					formattedString += "'";
				} else {
					formattedString += quotedString.substring(1, quotedString.length - 1);
				}
			} else if (otherLetters) {
				// Swallow non-pattern letters by doing nothing here
			} else if (otherCharacters) {
				// Simply output other characters
				formattedString += otherCharacters;
			} else if (patternLetters) {
				// Replace pattern letters
				const patternLetter = patternLetters.charAt(0);
				const numberOfLetters = patternLetters.length;
				let rawData = "";
				switch (patternLetter) {
					case "G":
						rawData = "AD";
						break;
					case "y":
						rawData = date.getFullYear().toString();
						break;
					case "M":
						rawData = date.getMonth().toString();
						break;
					case "w":
						rawData = this.getWeekInYear(date, this.getMinimalDaysInFirstWeek()).toString();
						break;
					case "W":
						rawData = this.getWeekInMonth(date, this.getMinimalDaysInFirstWeek()).toString();
						break;
					case "D":
						rawData = this.getDayInYear(date).toString();
						break;
					case "d":
						rawData = date.getDate().toString();
						break;
					case "F":
						rawData = (1 + Math.floor((date.getDate() - 1) / 7)).toString();
						break;
					case "E":
						rawData = SimpleDateFormat.dayNames[date.getDay()];
						break;
					case "a":
						rawData = (date.getHours() >= 12) ? "PM" : "AM";
						break;
					case "H":
						rawData = date.getHours().toString();
						break;
					case "k":
						rawData = (date.getHours() || 24).toString();
						break;
					case "K":
						rawData = (date.getHours() % 12).toString();
						break;
					case "h":
						rawData = ((date.getHours() % 12) || 12).toString();
						break;
					case "m":
						rawData = date.getMinutes().toString();
						break;
					case "s":
						rawData = date.getSeconds().toString();
						break;
					case "S":
						rawData = date.getMilliseconds().toString();
						break;
					case "Z":
						// This returns the number of minutes since GMT was this time.
						rawData = date.getTimezoneOffset().toString();
						break;
				}
				// Format the raw data depending on the type
				switch (SimpleDateFormat.types[patternLetter]) {
					case SimpleDateFormat.TEXT2:
						formattedString += this.formatText(rawData, numberOfLetters, 2);
						break;
					case SimpleDateFormat.TEXT3:
						formattedString += this.formatText(rawData, numberOfLetters, 3);
						break;
					case SimpleDateFormat.NUMBER:
						formattedString += this.formatNumber(rawData, numberOfLetters);
						break;
					case SimpleDateFormat.YEAR:
						if (numberOfLetters <= 3) {
							// Output a 2-digit year
							const dataString = "" + rawData;
							formattedString += dataString.substr(2, 2);
						} else {
							formattedString += this.formatNumber(rawData, numberOfLetters);
						}
						break;
					case SimpleDateFormat.MONTH:
						if (numberOfLetters >= 3) {
							formattedString +=
								this.formatText(SimpleDateFormat.monthNames[parseInt(rawData, 10)], numberOfLetters, numberOfLetters);
						} else {
							// NB. Months returned by getMonth are zero-based
							formattedString += this.formatNumber(rawData + 1, numberOfLetters);
						}
						break;
					case SimpleDateFormat.TIMEZONE:
						const rawDataAsNumber = parseFloat(rawData);
						const isPositive = (rawDataAsNumber > 0);
						// The following line looks like a mistake but isn't
						// because of the way getTimezoneOffset measures.
						const prefix = isPositive ? "-" : "+";
						const absData = Math.abs(rawDataAsNumber);

						// Hours
						const hours = this.padWithZeroes(Math.floor(absData / 60).toString(), 2);
						// Minutes
						const minutes = this.padWithZeroes((absData % 60).toString(), 2);

						formattedString += prefix + hours + minutes;
						break;
				}
			}
			searchString = searchString.substr(result.index + result[0].length);
		}
		return formattedString;
	}

	private padWithZeroes(str: string, len: number) {
		while (str.length < len) {
			str = "0" + str;
		}
		return str;
	}

	private formatText(data: string, numberOfLetters: number, minLength: number) {
		return (numberOfLetters >= 4) ? data : data.substr(0, Math.max(minLength, numberOfLetters));
	}

	private formatNumber(data: string, numberOfLetters: number) {
		// Pad with 0s as necessary
		return this.padWithZeroes(data, numberOfLetters);
	}

	private newDateAtMidnight(year: number, month: number, day: number): Date {
		const d = new Date(year, month, day, 0, 0, 0);
		d.setMilliseconds(0);
		return d;
	}

	private isBefore(date1: Date, date2: Date) {
		return date1.getTime() < date2.getTime();
	}

	private getUTCTime(date: Date): number {
		return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(),
			date.getSeconds(), date.getMilliseconds());
	}

	private getTimeSince(date1: Date, date2: Date): number {
		return this.getUTCTime(date1) - this.getUTCTime(date2);
	}

	private getPreviousSunday(date: Date) {
		// Using midday avoids any possibility of DST messing things up
		const midday = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
		const previousSunday = new Date(midday.getTime() - date.getDay() * SimpleDateFormat.ONE_DAY);
		return this.newDateAtMidnight(previousSunday.getFullYear(), previousSunday.getMonth(),
			previousSunday.getDate());
	}

	private getWeekInYear(date: Date, minimalDaysInFirstWeek: number): number {
		const previousSunday = this.getPreviousSunday(date);
		const startOfYear = this.newDateAtMidnight(date.getFullYear(), 0, 1);
		const numberOfSundays = this.isBefore(previousSunday, startOfYear) ?
			0 : 1 + Math.floor(this.getTimeSince(previousSunday, startOfYear) / SimpleDateFormat.ONE_WEEK);
		const numberOfDaysInFirstWeek = 7 - startOfYear.getDay();
		let weekInYear = numberOfSundays;
		if (numberOfDaysInFirstWeek < minimalDaysInFirstWeek) {
			weekInYear--;
		}
		return weekInYear;
	}

	private getWeekInMonth(date: Date, minimalDaysInFirstWeek: number): number {
		const previousSunday = this.getPreviousSunday(date);
		const startOfMonth = this.newDateAtMidnight(date.getFullYear(), date.getMonth(), 1);
		const numberOfSundays = this.isBefore(previousSunday, startOfMonth) ?
			0 : 1 + Math.floor(this.getTimeSince(previousSunday, startOfMonth) / SimpleDateFormat.ONE_WEEK);
		const numberOfDaysInFirstWeek = 7 - startOfMonth.getDay();
		let weekInMonth = numberOfSundays;
		if (numberOfDaysInFirstWeek >= minimalDaysInFirstWeek) {
			weekInMonth++;
		}
		return weekInMonth;
	}

	private getDayInYear(date: Date) {
		const startOfYear = this.newDateAtMidnight(date.getFullYear(), 0, 1);
		return 1 + Math.floor(this.getTimeSince(date, startOfYear) / SimpleDateFormat.ONE_DAY);
	}
}
