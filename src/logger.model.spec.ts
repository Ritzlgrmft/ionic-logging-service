// tslint:disable:no-magic-numbers
import * as log4javascript from "log4javascript";

import { Logger } from "./logger.model";
import { LogLevel } from "./log-level.model";

describe("Logger", () => {

	afterEach(() => {
		log4javascript.resetConfiguration();
		log4javascript.getRootLogger().removeAllAppenders();
	});

	describe("formatArgument(arg: any): string", () => {
		it("string argument keeps unchanged", () => {

			const logger = new Logger();
			const argument = "test";

			const formattedArgument = logger.formatArgument(argument);

			expect(formattedArgument).toBe("test");
		});

		it("number argument convert to string using invariant culture", () => {

			const logger = new Logger();
			const argument = 42.3;

			const formattedArgument = logger.formatArgument(argument);

			expect(formattedArgument).toBe("42.3");
		});

		it("array argument converted using JSON converter", () => {

			const logger = new Logger();
			const argument = ["test", 42.3];

			const formattedArgument = logger.formatArgument(argument);

			expect(formattedArgument).toBe("[\"test\",42.3]");
		});

		it("object argument converted using JSON converter", () => {

			const logger = new Logger();
			const argument = { prop1: "test", prop2: 42.3 };

			const formattedArgument = logger.formatArgument(argument);

			expect(formattedArgument).toBe("{\"prop1\":\"test\",\"prop2\":42.3}");
		});

		it("object argument with circular structure", () => {

			const cyclicErrorNodeJS = "JSON.stringify cannot serialize cyclic structures.";
			const cyclicErrorChrome = "Converting circular structure to JSON";

			const logger = new Logger();
			const argument: { me: any } = { me: undefined };
			argument.me = argument;

			const formattedArgument = logger.formatArgument(argument);
			if (formattedArgument !== cyclicErrorNodeJS && formattedArgument !== cyclicErrorChrome) {
				fail(formattedArgument);
			}
		});

		it("error argument converted using toString()", () => {

			const logger = new Logger();
			const argument = new TypeError("test");

			const formattedArgument = logger.formatArgument(argument);

			expect(formattedArgument).toBe("TypeError: test");
		});
	});

	describe("info(methodName: string, ...params: any[]): void", () => {

		it("writes log with arguments", () => {

			const log4javascriptLogger = {
				isInfoEnabled: jasmine.createSpy("isInfoEnabled").and.returnValue(true),
				info: jasmine.createSpy("info")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.info("myMethod", "test", 42.3);

			expect(log4javascriptLogger.info).toHaveBeenCalledWith("myMethod", "test", "42.3");
		});

		it("writes no log if logging is disabled", () => {

			const log4javascriptLogger = {
				isInfoEnabled: jasmine.createSpy("isInfoEnabled").and.returnValue(false),
				info: jasmine.createSpy("info")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.info("myMethod", "test", 42.3);

			expect(log4javascriptLogger.info.calls.count()).toBe(0);
		});
	});

	describe("debug(methodName: string, ...params: any[]): void", () => {

		it("writes log with arguments", () => {

			const log4javascriptLogger = {
				isDebugEnabled: jasmine.createSpy("isDebugEnabled").and.returnValue(true),
				debug: jasmine.createSpy("debug")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.debug("myMethod", "test", 42.3);

			expect(log4javascriptLogger.debug).toHaveBeenCalledWith("myMethod", "test", "42.3");
		});

		it("writes no log if logging is disabled", () => {

			const log4javascriptLogger = {
				isDebugEnabled: jasmine.createSpy("isDebugEnabled").and.returnValue(false),
				debug: jasmine.createSpy("debug")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.debug("myMethod", "test", 42.3);

			expect(log4javascriptLogger.debug.calls.count()).toBe(0);
		});
	});

	describe("warn(methodName: string, ...params: any[]): void", () => {

		it("writes log with arguments", () => {

			const log4javascriptLogger = {
				isWarnEnabled: jasmine.createSpy("isWarnEnabled").and.returnValue(true),
				warn: jasmine.createSpy("warn")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.warn("myMethod", "test", 42.3);

			expect(log4javascriptLogger.warn).toHaveBeenCalledWith("myMethod", "test", "42.3");
		});

		it("writes no log if logging is disabled", () => {

			const log4javascriptLogger = {
				isWarnEnabled: jasmine.createSpy("isWarnEnabled").and.returnValue(false),
				warn: jasmine.createSpy("warn")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.warn("myMethod", "test", 42.3);

			expect(log4javascriptLogger.warn.calls.count()).toBe(0);
		});
	});

	describe("error(methodName: string, ...params: any[]): void", () => {

		it("writes log with arguments", () => {

			const log4javascriptLogger = {
				isErrorEnabled: jasmine.createSpy("isErrorEnabled").and.returnValue(true),
				error: jasmine.createSpy("error")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.error("myMethod", "test", 42.3);

			expect(log4javascriptLogger.error).toHaveBeenCalledWith("myMethod", "test", "42.3");
		});

		it("writes no log if logging is disabled", () => {

			const log4javascriptLogger = {
				isErrorEnabled: jasmine.createSpy("isErrorEnabled").and.returnValue(false),
				error: jasmine.createSpy("error")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.error("myMethod", "test", 42.3);

			expect(log4javascriptLogger.error.calls.count()).toBe(0);
		});
	});

	describe("entry(methodName: string, ...params: any[]): void", () => {

		it("writes log with arguments", () => {

			const log4javascriptLogger = {
				isInfoEnabled: jasmine.createSpy("isInfoEnabled").and.returnValue(true),
				isDebugEnabled: jasmine.createSpy("isDebugEnabled").and.returnValue(true),
				info: jasmine.createSpy("info")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.entry("myMethod", "test", 42.3);

			expect(log4javascriptLogger.info).toHaveBeenCalledWith("myMethod", "entry", "test", "42.3");
		});

		it("writes no log if info logging is disabled", () => {

			const log4javascriptLogger = {
				isInfoEnabled: jasmine.createSpy("isInfoEnabled").and.returnValue(false),
				isDebugEnabled: jasmine.createSpy("isDebugEnabled").and.returnValue(false),
				info: jasmine.createSpy("info")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.entry("myMethod", "test", 42.3);

			expect(log4javascriptLogger.info.calls.count()).toBe(0);
		});

		it("writes no arguments if debug logging is disabled", () => {

			const log4javascriptLogger = {
				isInfoEnabled: jasmine.createSpy("isInfoEnabled").and.returnValue(true),
				isDebugEnabled: jasmine.createSpy("isDebugEnabled").and.returnValue(false),
				info: jasmine.createSpy("info")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.entry("myMethod", "test", 42.3);

			expect(log4javascriptLogger.info).toHaveBeenCalledWith("myMethod", "entry");
		});

	});

	describe("exit(methodName: string, ...params: any[]): void", () => {

		it("writes log with arguments", () => {

			const log4javascriptLogger = {
				isInfoEnabled: jasmine.createSpy("isInfoEnabled").and.returnValue(true),
				isDebugEnabled: jasmine.createSpy("isDebugEnabled").and.returnValue(true),
				info: jasmine.createSpy("info")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.exit("myMethod", "test", 42.3);

			expect(log4javascriptLogger.info).toHaveBeenCalledWith("myMethod", "exit", "test", "42.3");
		});

		it("writes no log if info logging is disabled", () => {

			const log4javascriptLogger = {
				isInfoEnabled: jasmine.createSpy("isInfoEnabled").and.returnValue(false),
				isDebugEnabled: jasmine.createSpy("isDebugEnabled").and.returnValue(false),
				info: jasmine.createSpy("info")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.exit("myMethod", "test", 42.3);

			expect(log4javascriptLogger.info.calls.count()).toBe(0);
		});

		it("writes no arguments if debug logging is disabled", () => {

			const log4javascriptLogger = {
				isInfoEnabled: jasmine.createSpy("isInfoEnabled").and.returnValue(true),
				isDebugEnabled: jasmine.createSpy("isDebugEnabled").and.returnValue(false),
				info: jasmine.createSpy("info")
			};
			const logger = new Logger(log4javascriptLogger);

			logger.exit("myMethod", "test", 42.3);

			expect(log4javascriptLogger.info).toHaveBeenCalledWith("myMethod", "exit");
		});

	});

	describe("setLogLevel(level: LogLevel): void", () => {

		it("changes log level of internal logger", () => {

			const logger = new Logger();
			expect(logger.getInternalLogger().getLevel()).toBe(log4javascript.Level.DEBUG);

			logger.setLogLevel(LogLevel.WARN);
			expect(logger.getInternalLogger().getLevel()).toBe(log4javascript.Level.WARN);
		});
	});
});