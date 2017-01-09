import * as log4javascript from "log4javascript";

import { LogLevel } from "./log-level.model";
import { LogLevelConverter } from "./log-level.converter";

describe("LogLevelConverter", () => {

	describe("levelFromLog4Javascript(level: log4javascript.Level): LogLevel", () => {

		it("log4javascript.Level.ALL", () => {
			const value = log4javascript.Level.ALL;

			const convertedValue = LogLevelConverter.levelFromLog4Javascript(value);

			expect(convertedValue).toBe(LogLevel.ALL);
		});

		it("log4javascript.Level.DEBUG", () => {
			const value = log4javascript.Level.DEBUG;

			const convertedValue = LogLevelConverter.levelFromLog4Javascript(value);

			expect(convertedValue).toBe(LogLevel.DEBUG);
		});

		it("log4javascript.Level.ERROR", () => {
			const value = log4javascript.Level.ERROR;

			const convertedValue = LogLevelConverter.levelFromLog4Javascript(value);

			expect(convertedValue).toBe(LogLevel.ERROR);
		});

		it("log4javascript.Level.FATAL", () => {
			const value = log4javascript.Level.FATAL;

			const convertedValue = LogLevelConverter.levelFromLog4Javascript(value);

			expect(convertedValue).toBe(LogLevel.FATAL);
		});

		it("log4javascript.Level.INFO", () => {
			const value = log4javascript.Level.INFO;

			const convertedValue = LogLevelConverter.levelFromLog4Javascript(value);

			expect(convertedValue).toBe(LogLevel.INFO);
		});

		it("log4javascript.Level.OFF", () => {
			const value = log4javascript.Level.OFF;

			const convertedValue = LogLevelConverter.levelFromLog4Javascript(value);

			expect(convertedValue).toBe(LogLevel.OFF);
		});

		it("log4javascript.Level.TRACE", () => {
			const value = log4javascript.Level.TRACE;

			const convertedValue = LogLevelConverter.levelFromLog4Javascript(value);

			expect(convertedValue).toBe(LogLevel.TRACE);
		});

		it("log4javascript.Level.WARN", () => {
			const value = log4javascript.Level.WARN;

			const convertedValue = LogLevelConverter.levelFromLog4Javascript(value);

			expect(convertedValue).toBe(LogLevel.WARN);
		});

		it("throws exception, when given level is invalid", () => {
			const value = 42;

			try {
				LogLevelConverter.levelFromLog4Javascript(value);
				fail("no error thrown");
			} catch (e) {
				expect(e).toBe("invalid level: 42");
			}
		});
	});

	describe("levelFromString(level: string): LogLevel", () => {

		it("ALL", () => {
			const value = "ALL";

			const convertedValue = LogLevelConverter.levelFromString(value);

			expect(convertedValue).toBe(LogLevel.ALL);
		});

		it("DEBUG", () => {
			const value = "DEBUG";

			const convertedValue = LogLevelConverter.levelFromString(value);

			expect(convertedValue).toBe(LogLevel.DEBUG);
		});

		it("ERROR", () => {
			const value = "ERROR";

			const convertedValue = LogLevelConverter.levelFromString(value);

			expect(convertedValue).toBe(LogLevel.ERROR);
		});

		it("FATAL", () => {
			const value = "FATAL";

			const convertedValue = LogLevelConverter.levelFromString(value);

			expect(convertedValue).toBe(LogLevel.FATAL);
		});

		it("INFO", () => {
			const value = "INFO";

			const convertedValue = LogLevelConverter.levelFromString(value);

			expect(convertedValue).toBe(LogLevel.INFO);
		});

		it("OFF", () => {
			const value = "OFF";

			const convertedValue = LogLevelConverter.levelFromString(value);

			expect(convertedValue).toBe(LogLevel.OFF);
		});

		it("TRACE", () => {
			const value = "TRACE";

			const convertedValue = LogLevelConverter.levelFromString(value);

			expect(convertedValue).toBe(LogLevel.TRACE);
		});

		it("WARN", () => {
			const value = "WARN";

			const convertedValue = LogLevelConverter.levelFromString(value);

			expect(convertedValue).toBe(LogLevel.WARN);
		});

		it("throws exception, when given level is invalid", () => {
			const value = "xxx";

			try {
				LogLevelConverter.levelFromString(value);
				fail("no error thrown");
			} catch (e) {
				expect(e).toBe("invalid level: xxx");
			}
		});
	});

	describe("levelToLog4Javascript(level: LogLevel): log4javascript.Level", () => {

		it("LogLevel.ALL", () => {
			const value = LogLevel.ALL;

			const convertedValue = LogLevelConverter.levelToLog4Javascript(value);

			expect(convertedValue).toBe(log4javascript.Level.ALL);
		});

		it("LogLevel.DEBUG", () => {
			const value = LogLevel.DEBUG;

			const convertedValue = LogLevelConverter.levelToLog4Javascript(value);

			expect(convertedValue).toBe(log4javascript.Level.DEBUG);
		});

		it("LogLevel.ERROR", () => {
			const value = LogLevel.ERROR;

			const convertedValue = LogLevelConverter.levelToLog4Javascript(value);

			expect(convertedValue).toBe(log4javascript.Level.ERROR);
		});

		it("LogLevel.FATAL", () => {
			const value = LogLevel.FATAL;

			const convertedValue = LogLevelConverter.levelToLog4Javascript(value);

			expect(convertedValue).toBe(log4javascript.Level.FATAL);
		});

		it("LogLevel.INFO", () => {
			const value = LogLevel.INFO;

			const convertedValue = LogLevelConverter.levelToLog4Javascript(value);

			expect(convertedValue).toBe(log4javascript.Level.INFO);
		});

		it("LogLevel.OFF", () => {
			const value = LogLevel.OFF;

			const convertedValue = LogLevelConverter.levelToLog4Javascript(value);

			expect(convertedValue).toBe(log4javascript.Level.OFF);
		});

		it("LogLevel.TRACE", () => {
			const value = LogLevel.TRACE;

			const convertedValue = LogLevelConverter.levelToLog4Javascript(value);

			expect(convertedValue).toBe(log4javascript.Level.TRACE);
		});

		it("LogLevel.WARN", () => {
			const value = LogLevel.WARN;

			const convertedValue = LogLevelConverter.levelToLog4Javascript(value);

			expect(convertedValue).toBe(log4javascript.Level.WARN);
		});

		it("throws exception, when given level is invalid", () => {
			const value = 42;

			try {
				LogLevelConverter.levelToLog4Javascript(value);
				fail("no error thrown");
			} catch (e) {
				expect(e).toBe("invalid level: 42");
			}
		});
	});
});