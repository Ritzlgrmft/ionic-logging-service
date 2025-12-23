/* eslint-disable no-magic-numbers */
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";

import * as log4javascript from "log4javascript";

import { AjaxAppender } from "./ajax-appender.model";
import { LocalStorageAppender } from "./local-storage-appender.model";
import { LogMessage } from "./log-message.model";
import { Logger } from "./logger.model";
import { LoggingServiceConfiguration } from "./logging-service.configuration";
import { LoggingService } from "./logging.service";
import { MemoryAppender } from "./memory-appender.model";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("LoggingService", () => {

	let loggingService: LoggingService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
    imports: [],
    providers: [
        LoggingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
		loggingService = TestBed.inject(LoggingService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
		log4javascript.resetConfiguration();
		log4javascript.getRootLogger().removeAllAppenders();
	});

	describe("ctor()", () => {

		it("root logger has log level WARN", () => {

			const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
			const browserConsoleAppender = appenders.find((a) => a.toString() === "BrowserConsoleAppender");
			browserConsoleAppender.setThreshold(log4javascript.Level.OFF);

			loggingService.getRootLogger().info("test");
			loggingService.getRootLogger().warn("test");
			const messages = loggingService.getLogMessages();

			expect(messages.length).toBe(1);
		});
	});

	describe("configure(configuration: LoggingServiceConfiguration): void", () => {

		it("throws no error if no configuration is provided", () => {

			expect(() => loggingService.configure(undefined)).not.toThrow();
		});

		it("throws no error if configuration is empty", () => {

			const config: LoggingServiceConfiguration = {};
			expect(() => loggingService.configure(config)).not.toThrow();
		});

		describe("logLevels", () => {
			it("throws no error if logLevels is empty", () => {

				const logLevels: Array<{ loggerName: string; logLevel: string }> = [];
				const config: LoggingServiceConfiguration = {
					logLevels,
				};

				expect(() => loggingService.configure(config)).not.toThrow();
			});

			it("change log level of root logger", () => {

				const logLevels = [{ loggerName: "root", logLevel: "INFO" }];
				const config: LoggingServiceConfiguration = {
					logLevels,
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				expect(internalLogger.getEffectiveLevel()).toBe(log4javascript.Level.INFO);
			});

			it("change log level of custom logger, root logger remains unchanged", () => {

				const logLevels = [{ loggerName: "me", logLevel: "INFO" }];
				const config: LoggingServiceConfiguration = {
					logLevels,
				};

				loggingService.configure(config);
				const internalLoggerMe = new Logger("me").getInternalLogger();
				expect(internalLoggerMe.getEffectiveLevel()).toBe(log4javascript.Level.INFO);
				const internalLoggerRoot = new Logger().getInternalLogger();
				expect(internalLoggerRoot.getEffectiveLevel()).toBe(log4javascript.Level.WARN);
			});

			it("throws error if custom logger has an invalid log level", () => {

				const logLevels = [{ loggerName: "me", logLevel: "xxx" }];
				const config: LoggingServiceConfiguration = {
					logLevels,
				};

				expect(() => loggingService.configure(config)).toThrowError("invalid log level xxx");
			});
		});

		describe("ajaxAppender", () => {
			it("adds no ajaxAppender if not configured", () => {

				const config: LoggingServiceConfiguration = {
				};

				const internalLogger = new Logger().getInternalLogger();
				const oldAppenderCount = internalLogger.getEffectiveAppenders().length;

				loggingService.configure(config);

				const newAppenderCount = internalLogger.getEffectiveAppenders().length;
				expect(newAppenderCount).toBe(oldAppenderCount);
			});

			it("adds ajaxAppender if configured", () => {

				const config: LoggingServiceConfiguration = {
					ajaxAppender: {
						url: "myUrl",
					},
				};

				const internalLogger = new Logger().getInternalLogger();
				const oldAppenderCount = internalLogger.getEffectiveAppenders().length;

				loggingService.configure(config);

				const newAppenderCount = internalLogger.getEffectiveAppenders().length;
				expect(newAppenderCount).toBe(oldAppenderCount + 1);
			});

			it("throws error if ajaxAppender has an invalid threshold", () => {

				const config: LoggingServiceConfiguration = {
					ajaxAppender: {
						threshold: "xxx",
						url: "myUrl",
					},
				};

				expect(() => loggingService.configure(config)).toThrowError("invalid level xxx");
			});

			it("ajaxAppender has default threshold of WARN", () => {

				const config: LoggingServiceConfiguration = {
					ajaxAppender: {
						url: "myUrl",
					},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const ajaxAppender = appenders.find((a) => a.toString() === "Ionic.Logging.AjaxAppender") as AjaxAppender;

				expect(ajaxAppender.getThreshold()).toBe(log4javascript.Level.WARN);
			});

			it("ajaxAppender has default timer interval of 0", () => {

				const config: LoggingServiceConfiguration = {
					ajaxAppender: {
						url: "myUrl",
					},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const ajaxAppender = appenders.find((a) => a.toString() === "Ionic.Logging.AjaxAppender") as AjaxAppender;

				expect(ajaxAppender.getInternalAppender().isTimed()).toBeFalsy();
				expect(ajaxAppender.getTimerInterval()).toBe(0);
			});

			it("ajaxAppender has given timer interval", () => {

				const config: LoggingServiceConfiguration = {
					ajaxAppender: {
						timerInterval: 1234,
						url: "myUrl",
					},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const ajaxAppender = appenders.find((a) => a.toString() === "Ionic.Logging.AjaxAppender") as AjaxAppender;

				expect(ajaxAppender.getInternalAppender().isTimed()).toBeTruthy();
				expect(ajaxAppender.getTimerInterval()).toBe(1234);
			});

			it("ajaxAppender has default batch size of 1", () => {

				const config: LoggingServiceConfiguration = {
					ajaxAppender: {
						url: "myUrl",
					},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const ajaxAppender = appenders.find((a) => a.toString() === "Ionic.Logging.AjaxAppender") as AjaxAppender;

				expect(ajaxAppender.getBatchSize()).toBe(1);
			});

			it("ajaxAppender has given timer interval", () => {

				const config: LoggingServiceConfiguration = {
					ajaxAppender: {
						batchSize: 1234,
						url: "myUrl",
					},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const ajaxAppender = appenders.find((a) => a.toString() === "Ionic.Logging.AjaxAppender") as AjaxAppender;

				expect(ajaxAppender.getBatchSize()).toBe(1234);
			});
		});

		describe("localStorageAppender", () => {
			it("adds no localStorageAppender if not configured", () => {

				const config: LoggingServiceConfiguration = {
				};

				const internalLogger = new Logger().getInternalLogger();
				const oldAppenderCount = internalLogger.getEffectiveAppenders().length;

				loggingService.configure(config);

				const newAppenderCount = internalLogger.getEffectiveAppenders().length;
				expect(newAppenderCount).toBe(oldAppenderCount);
			});

			it("adds localStorageAppender if configured", () => {

				const config: LoggingServiceConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage",
					},
				};

				const internalLogger = new Logger().getInternalLogger();
				const oldAppenderCount = internalLogger.getEffectiveAppenders().length;

				loggingService.configure(config);

				const newAppenderCount = internalLogger.getEffectiveAppenders().length;
				expect(newAppenderCount).toBe(oldAppenderCount + 1);
			});

			it("throws error if localStorageAppender has an invalid threshold", () => {

				const config: LoggingServiceConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage",
						threshold: "xxx",
					},
				};

				expect(() => loggingService.configure(config)).toThrowError("invalid level xxx");
			});

			it("localStorageAppender has default threshold of WARN", () => {

				const config: LoggingServiceConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage",
					},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const localStorageAppender = appenders.find(
					(a) => a.toString() === "Ionic.Logging.LocalStorageAppender") as LocalStorageAppender;

				expect(localStorageAppender.getThreshold()).toBe(log4javascript.Level.WARN);
			});

			it("localStorageAppender has given threshold", () => {

				const config: LoggingServiceConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage",
						threshold: "INFO",
					},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const localStorageAppender = appenders.find(
					(a) => a.toString() === "Ionic.Logging.LocalStorageAppender") as LocalStorageAppender;

				expect(localStorageAppender.getThreshold()).toBe(log4javascript.Level.INFO);
			});

			it("localStorageAppender has default max messages of 250", () => {

				const config: LoggingServiceConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage",
					},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const localStorageAppender = appenders.find(
					(a) => a.toString() === "Ionic.Logging.LocalStorageAppender") as LocalStorageAppender;

				expect(localStorageAppender.getMaxMessages()).toBe(250);
			});

			it("localStorageAppender has given max messages", () => {

				const config: LoggingServiceConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage",
						maxMessages: 1234,
					},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const localStorageAppender = appenders.find(
					(a) => a.toString() === "Ionic.Logging.LocalStorageAppender") as LocalStorageAppender;

				expect(localStorageAppender.getMaxMessages()).toBe(1234);
			});
		});

		describe("memoryAppender", () => {
			it("memoryAppender has default max messages of 250", () => {

				const config: LoggingServiceConfiguration = {
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const memoryAppender = appenders.find((a) => a.toString() === "Ionic.Logging.MemoryAppender") as MemoryAppender;

				expect(memoryAppender.getMaxMessages()).toBe(250);
			});

			it("memoryAppender has default configuration id memoryAppender configuration is empty", () => {

				const config: LoggingServiceConfiguration = {
					memoryAppender: {},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const memoryAppender = appenders.find((a) => a.toString() === "Ionic.Logging.MemoryAppender") as MemoryAppender;

				expect(memoryAppender.getMaxMessages()).toBe(250);
			});

			it("memoryAppender has given max messages", () => {

				const config: LoggingServiceConfiguration = {
					memoryAppender: {
						maxMessages: 1234,
					},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const memoryAppender = appenders.find((a) => a.toString() === "Ionic.Logging.MemoryAppender") as MemoryAppender;

				expect(memoryAppender.getMaxMessages()).toBe(1234);
			});
		});

		describe("browserConsoleAppender", () => {
			it("browserConsoleAppender has default threshold", () => {

				const config: LoggingServiceConfiguration = {
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const browserConsoleAppender = appenders.find((a) => a.toString() === "BrowserConsoleAppender");

				expect(browserConsoleAppender.getThreshold()).toBe(log4javascript.Level.ALL);
			});

			it("empty configuration for browserConsoleAppender", () => {

				const config: LoggingServiceConfiguration = {
					browserConsoleAppender: {},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const browserConsoleAppender = appenders.find((a) => a.toString() === "BrowserConsoleAppender");

				expect(browserConsoleAppender.getThreshold()).toBe(log4javascript.Level.ALL);
			});

			it("browserConsoleAppender has given threshold", () => {

				const config: LoggingServiceConfiguration = {
					browserConsoleAppender: {
						threshold: "OFF",
					},
				};

				loggingService.configure(config);
				const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
				const browserConsoleAppender = appenders.find((a) => a.toString() === "BrowserConsoleAppender");

				expect(browserConsoleAppender.getThreshold()).toBe(log4javascript.Level.OFF);
			});
		});
	});

	describe("getLogger(loggerName: string): Logger", () => {

		it("returns logger with given name", () => {

			const logger = loggingService.getLogger("myLogger");

			const loggerName = logger.getInternalLogger().name;
			expect(loggerName).toBe("myLogger");
		});
	});

	describe("getRootLogger(): Logger", () => {

		it("returns logger with root name", () => {

			const logger = loggingService.getRootLogger();

			const loggerName = logger.getInternalLogger().name;
			expect(loggerName).toBe("root");
		});
	});

	describe("getLogMessages(): LogMessage[]", () => {

		it("returns empty array if no log message is written", () => {

			const messages = loggingService.getLogMessages();

			expect(messages.length).toBe(0);
		});

		it("returns array with written log message", () => {

			const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
			const browserConsoleAppender = appenders.find((a) => a.toString() === "BrowserConsoleAppender");
			browserConsoleAppender.setThreshold(log4javascript.Level.OFF);

			loggingService.getRootLogger().warn("test");
			const messages = loggingService.getLogMessages();

			expect(messages.length).toBe(1);
		});
	});

	describe("logMessagesChanged: EventEmitter<void>", () => {

		it("logged messages are emitted", (done: () => void) => {
			const appenders = new Logger().getInternalLogger().getEffectiveAppenders();
			const browserConsoleAppender = appenders.find((a) => a.toString() === "BrowserConsoleAppender");
			browserConsoleAppender.setThreshold(log4javascript.Level.OFF);

			loggingService.logMessagesChanged.subscribe(() => {
				expect(1).toBe(loggingService.getLogMessages().length);
				done();
			});

			loggingService.getRootLogger().warn("test");
		});
	});

	describe("ajaxAppenderFailed: EventEmitter<string>", () => {

		it("error message emitted", (done: () => void) => {
			const config: LoggingServiceConfiguration = {
				ajaxAppender: {
					url: "badUrl",
				},
				browserConsoleAppender: {
					threshold: "OFF",
				},
			};
			loggingService.configure(config);

			loggingService.ajaxAppenderFailed.subscribe((message: string) => {
				expect(message).toBe("AjaxAppender.append: XMLHttpRequest request to URL badUrl returned status code 404");
				done();
			});

			loggingService.getRootLogger().warn("test");
		});
	});

	describe("getLogMessagesFromLocalStorage(localStorageKey: string): LogMessage[]", () => {

		it("returns empty array if no log message is written", () => {

			localStorage.removeItem("xxx");

			const messages = loggingService.getLogMessagesFromLocalStorage("xxx");

			expect(messages.length).toBe(0);
		});

		it("returns array with written log message", () => {

			const messagesIn = [{
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			}];
			localStorage.setItem("xxx", JSON.stringify(messagesIn));

			const messages = loggingService.getLogMessagesFromLocalStorage("xxx");

			expect(messages.length).toBe(1);
		});
	});

	describe("removeLogMessages(): void", () => {

		it("removes messages", (done: () => void) => {

			loggingService.getRootLogger().info("test");

			loggingService.logMessagesChanged.subscribe(() => {
				expect(loggingService.getLogMessages().length).toBe(0);
				done();
			});

			loggingService.removeLogMessages();
		});
	});

	describe("removeLogMessagesFromLocalStorage(localStorageKey: string): void", () => {

		it("removes messages", (done: () => void) => {

			const messagesIn = [{
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			}];
			localStorage.setItem("xxx", JSON.stringify(messagesIn));

			loggingService.logMessagesChanged.subscribe(() => {
				expect(localStorage.getItem("xxx")).toBeNull();
				done();
			});

			loggingService.removeLogMessagesFromLocalStorage("xxx");
		});
	});
});
