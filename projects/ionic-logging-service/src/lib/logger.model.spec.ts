import { afterEach, describe, it, expect, beforeEach, vi } from "vitest";

import * as log4javascript from "log4javascript";

import { LogLevel } from "./log-level.model";
import { Logger } from "./logger.model";

describe("Logger", () => {

    afterEach(() => {
        log4javascript.resetConfiguration();
        log4javascript.getRootLogger().removeAllAppenders();
    });

    describe("ctor", () => {

        it("no logger passed, then root logger is used", () => {

            const logger = new Logger();
            const internalLogger = logger.getInternalLogger();

            expect(internalLogger.name).toBe("root");
        });

        it("logger name passed, then this logger is used", () => {

            const logger = new Logger("myLogger");
            const internalLogger = logger.getInternalLogger();

            expect(internalLogger.name).toBe("myLogger");
        });

        it("logger instance passed, then this logger is used", () => {

            const logger = new Logger({ name: "myLogger" });
            const internalLogger = logger.getInternalLogger();

            expect(internalLogger.name).toBe("myLogger");
        });
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
            const argument: {
                me: any;
            } = { me: undefined };
            argument.me = argument;

            const formattedArgument = logger.formatArgument(argument);
            expect(formattedArgument.startsWith(cyclicErrorNodeJS) || formattedArgument.startsWith(cyclicErrorChrome)).toBe(true);
        });

        it("error argument converted using toString()", () => {

            const logger = new Logger();
            const argument = new TypeError("test");

            const formattedArgument = logger.formatArgument(argument);

            expect(formattedArgument).toBe("TypeError: test");
        });
    });

    describe("trace(methodName: string, ...params: any[]): void", () => {

        it("writes log with arguments", () => {

            const log4javascriptLogger = {
                isTraceEnabled: vi.fn().mockReturnValue(true),
                trace: vi.fn(),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.trace("myMethod", "test", 42.3);

            expect(log4javascriptLogger.trace).toHaveBeenCalledWith("myMethod", "test", "42.3");
        });

        it("writes no log if logging is disabled", () => {

            const log4javascriptLogger = {
                isTraceEnabled: vi.fn().mockReturnValue(false),
                trace: vi.fn(),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.trace("myMethod", "test", 42.3);

            expect(vi.mocked(log4javascriptLogger.trace).mock.calls.length).toBe(0);
        });
    });

    describe("debug(methodName: string, ...params: any[]): void", () => {

        it("writes log with arguments", () => {

            const log4javascriptLogger = {
                debug: vi.fn(),
                isDebugEnabled: vi.fn().mockReturnValue(true),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.debug("myMethod", "test", 42.3);

            expect(log4javascriptLogger.debug).toHaveBeenCalledWith("myMethod", "test", "42.3");
        });

        it("writes no log if logging is disabled", () => {

            const log4javascriptLogger = {
                debug: vi.fn(),
                isDebugEnabled: vi.fn().mockReturnValue(false),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.debug("myMethod", "test", 42.3);

            expect(vi.mocked(log4javascriptLogger.debug).mock.calls.length).toBe(0);
        });
    });

    describe("info(methodName: string, ...params: any[]): void", () => {

        it("writes log with arguments", () => {

            const log4javascriptLogger = {
                info: vi.fn(),
                isInfoEnabled: vi.fn().mockReturnValue(true),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.info("myMethod", "test", 42.3);

            expect(log4javascriptLogger.info).toHaveBeenCalledWith("myMethod", "test", "42.3");
        });

        it("writes no log if logging is disabled", () => {

            const log4javascriptLogger = {
                info: vi.fn(),
                isInfoEnabled: vi.fn().mockReturnValue(false),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.info("myMethod", "test", 42.3);

            expect(vi.mocked(log4javascriptLogger.info).mock.calls.length).toBe(0);
        });
    });

    describe("warn(methodName: string, ...params: any[]): void", () => {

        it("writes log with arguments", () => {

            const log4javascriptLogger = {
                isWarnEnabled: vi.fn().mockReturnValue(true),
                warn: vi.fn(),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.warn("myMethod", "test", 42.3);

            expect(log4javascriptLogger.warn).toHaveBeenCalledWith("myMethod", "test", "42.3");
        });

        it("writes no log if logging is disabled", () => {

            const log4javascriptLogger = {
                isWarnEnabled: vi.fn().mockReturnValue(false),
                warn: vi.fn(),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.warn("myMethod", "test", 42.3);

            expect(vi.mocked(log4javascriptLogger.warn).mock.calls.length).toBe(0);
        });
    });

    describe("error(methodName: string, ...params: any[]): void", () => {

        it("writes log with arguments", () => {

            const log4javascriptLogger = {
                error: vi.fn(),
                isErrorEnabled: vi.fn().mockReturnValue(true),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.error("myMethod", "test", 42.3);

            expect(log4javascriptLogger.error).toHaveBeenCalledWith("myMethod", "test", "42.3");
        });

        it("writes no log if logging is disabled", () => {

            const log4javascriptLogger = {
                error: vi.fn(),
                isErrorEnabled: vi.fn().mockReturnValue(false),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.error("myMethod", "test", 42.3);

            expect(vi.mocked(log4javascriptLogger.error).mock.calls.length).toBe(0);
        });
    });

    describe("fatal(methodName: string, ...params: any[]): void", () => {

        it("writes log with arguments", () => {

            const log4javascriptLogger = {
                fatal: vi.fn(),
                isFatalEnabled: vi.fn().mockReturnValue(true),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.fatal("myMethod", "test", 42.3);

            expect(log4javascriptLogger.fatal).toHaveBeenCalledWith("myMethod", "test", "42.3");
        });

        it("writes no log if logging is disabled", () => {

            const log4javascriptLogger = {
                fatal: vi.fn(),
                isFatalEnabled: vi.fn().mockReturnValue(false),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.fatal("myMethod", "test", 42.3);

            expect(vi.mocked(log4javascriptLogger.fatal).mock.calls.length).toBe(0);
        });
    });

    describe("entry(methodName: string, ...params: any[]): void", () => {

        it("writes log with arguments", () => {

            const log4javascriptLogger = {
                info: vi.fn(),
                isDebugEnabled: vi.fn().mockReturnValue(true),
                isInfoEnabled: vi.fn().mockReturnValue(true),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.entry("myMethod", "test", 42.3);

            expect(log4javascriptLogger.info).toHaveBeenCalledWith("myMethod", "entry", "test", "42.3");
        });

        it("writes no log if info logging is disabled", () => {

            const log4javascriptLogger = {
                info: vi.fn(),
                isDebugEnabled: vi.fn().mockReturnValue(false),
                isInfoEnabled: vi.fn().mockReturnValue(false),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.entry("myMethod", "test", 42.3);

            expect(vi.mocked(log4javascriptLogger.info).mock.calls.length).toBe(0);
        });

        it("writes no arguments if debug logging is disabled", () => {

            const log4javascriptLogger = {
                info: vi.fn(),
                isDebugEnabled: vi.fn().mockReturnValue(false),
                isInfoEnabled: vi.fn().mockReturnValue(true),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.entry("myMethod", "test", 42.3);

            expect(log4javascriptLogger.info).toHaveBeenCalledWith("myMethod", "entry");
        });

    });

    describe("exit(methodName: string, ...params: any[]): void", () => {

        it("writes log with arguments", () => {

            const log4javascriptLogger = {
                info: vi.fn(),
                isDebugEnabled: vi.fn().mockReturnValue(true),
                isInfoEnabled: vi.fn().mockReturnValue(true),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.exit("myMethod", "test", 42.3);

            expect(log4javascriptLogger.info).toHaveBeenCalledWith("myMethod", "exit", "test", "42.3");
        });

        it("writes no log if info logging is disabled", () => {

            const log4javascriptLogger = {
                info: vi.fn(),
                isDebugEnabled: vi.fn().mockReturnValue(false),
                isInfoEnabled: vi.fn().mockReturnValue(false),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.exit("myMethod", "test", 42.3);

            expect(vi.mocked(log4javascriptLogger.info).mock.calls.length).toBe(0);
        });

        it("writes no arguments if debug logging is disabled", () => {

            const log4javascriptLogger = {
                info: vi.fn(),
                isDebugEnabled: vi.fn().mockReturnValue(false),
                isInfoEnabled: vi.fn().mockReturnValue(true),
            };
            const logger = new Logger(log4javascriptLogger);

            logger.exit("myMethod", "test", 42.3);

            expect(log4javascriptLogger.info).toHaveBeenCalledWith("myMethod", "exit");
        });

    });

    describe("getLogLevel(): LogLevel", () => {

        it("return log level of internal logger", () => {

            const logger = new Logger();
            expect(logger.getInternalLogger().getLevel()).toBe(log4javascript.Level.DEBUG);

            const level = logger.getLogLevel();
            expect(level).toBe(LogLevel.DEBUG);

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
