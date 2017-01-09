// tslint:disable:no-magic-numbers
import { inject, TestBed } from "@angular/core/testing";

import * as log4javascript from "log4javascript";

import { ConfigurationService } from "ionic-configuration-service";

import { LocalStorageAppender } from "./local-storage-appender.model";
import { Logger } from "./logger.model";
import { LoggingConfiguration } from "./logging-configuration.model";
import { LogMessage } from "./log-message.model";
import { LoggingService } from "./logging.service";

describe("LoggingService", () => {

	let loggingService: LoggingService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ConfigurationService,
				LoggingService
			]
		});
	});

	beforeEach(inject([LoggingService],
		(_loggingService: LoggingService) => {
			loggingService = _loggingService;
		}));

	afterEach(() => {
		log4javascript.resetConfiguration();
		log4javascript.getRootLogger().removeAllAppenders();
	});

	describe("constructor()", () => {

		it("root logger has log level WARN", () => {

			loggingService.getRootLogger().info("test");
			loggingService.getRootLogger().warn("test");
			const messages = loggingService.getLogMessages();

			expect(messages.length).toBe(1);
		});
	});

	describe("configure(configuration: LoggingConfiguration): void", () => {

		it("throws error if no configuration is provided", () => {

			try {
				(<any>window).__configuration = {};
				const myLoggingService = new LoggingService(new ConfigurationService(undefined));
				myLoggingService.configure(undefined);
				fail("no error thrown");
			} catch (e) {
				expect(e).toBe("no configuration provided");
			}
		});

		it("throws no error if configuration is empty", () => {

			const config: LoggingConfiguration = {};
			try {
				loggingService.configure(config);
			} catch (e) {
				fail(e);
			}
		});

		describe("logLevels", () => {
			it("throws no error if logLevels is empty", () => {

				const logLevels: { loggerName: string; logLevel: string; }[] = [];
				const config: LoggingConfiguration = {
					logLevels: logLevels
				};

				try {
					loggingService.configure(config);
				} catch (e) {
					fail(e);
				}
			});

			it("change log level of root logger", () => {

				const logLevels = [{ loggerName: "root", logLevel: "INFO" }];
				const config: LoggingConfiguration = {
					logLevels: logLevels
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				expect(internalLogger.getEffectiveLevel()).toBe(log4javascript.Level.INFO);
			});

			it("change log level of custom logger, root logger remains unchanged", () => {

				const logLevels = [{ loggerName: "me", logLevel: "INFO" }];
				const config: LoggingConfiguration = {
					logLevels: logLevels
				};

				loggingService.configure(config);
				const internalLoggerMe = new Logger("me").getInternalLogger();
				expect(internalLoggerMe.getEffectiveLevel()).toBe(log4javascript.Level.INFO);
				const internalLoggerRoot = new Logger().getInternalLogger();
				expect(internalLoggerRoot.getEffectiveLevel()).toBe(log4javascript.Level.WARN);
			});

			it("throws error if custom logger has an invalid log level", () => {

				const logLevels = [{ loggerName: "me", logLevel: "xxx" }];
				const config: LoggingConfiguration = {
					logLevels: logLevels
				};

				try {
					loggingService.configure(config);
					fail("no error thrown");
				} catch (e) {
					expect(e).toBe("invalid log level xxx");
				}
			});
		});

		describe("ajaxAppender", () => {
			it("adds no ajaxAppender if not configured", () => {

				const config: LoggingConfiguration = {
				};

				const internalLogger = new Logger().getInternalLogger();
				const oldAppenderCount = internalLogger.getEffectiveAppenders().length;

				loggingService.configure(config);

				const newAppenderCount = internalLogger.getEffectiveAppenders().length;
				expect(newAppenderCount).toBe(oldAppenderCount);
			});

			it("adds ajaxAppender if configured", () => {

				const config: LoggingConfiguration = {
					ajaxAppender: {
						url: "myUrl"
					}
				};

				const internalLogger = new Logger().getInternalLogger();
				const oldAppenderCount = internalLogger.getEffectiveAppenders().length;

				loggingService.configure(config);

				const newAppenderCount = internalLogger.getEffectiveAppenders().length;
				expect(newAppenderCount).toBe(oldAppenderCount + 1);
			});

			it("throws error if ajaxAppender has an invalid log level", () => {

				const config: LoggingConfiguration = {
					ajaxAppender: {
						url: "myUrl",
						logLevel: "xxx"
					}
				};

				try {
					loggingService.configure(config);
					fail("no error thrown");
				} catch (e) {
					expect(e).toBe("invalid log level xxx");
				}
			});

			it("ajaxAppender has default timer interval of 0", () => {

				const config: LoggingConfiguration = {
					ajaxAppender: {
						url: "myUrl"
					}
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				const ajaxAppender = <log4javascript.AjaxAppender>internalLogger.getEffectiveAppenders()[2];

				expect(ajaxAppender.isTimed()).toBeFalsy();
				expect(ajaxAppender.getTimerInterval()).toBe(0);
			});

			it("ajaxAppender has given timer interval", () => {

				const config: LoggingConfiguration = {
					ajaxAppender: {
						url: "myUrl",
						timerInterval: 1234
					}
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				const ajaxAppender = <log4javascript.AjaxAppender>internalLogger.getEffectiveAppenders()[2];

				expect(ajaxAppender.isTimed()).toBeTruthy();
				expect(ajaxAppender.getTimerInterval()).toBe(1234);
			});
		});

		describe("localStorageAppender", () => {
			it("adds no localStorageAppender if not configured", () => {

				const config: LoggingConfiguration = {
				};

				const internalLogger = new Logger().getInternalLogger();
				const oldAppenderCount = internalLogger.getEffectiveAppenders().length;

				loggingService.configure(config);

				const newAppenderCount = internalLogger.getEffectiveAppenders().length;
				expect(newAppenderCount).toBe(oldAppenderCount);
			});

			it("adds localStorageAppender if configured", () => {

				const config: LoggingConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage"
					}
				};

				const internalLogger = new Logger().getInternalLogger();
				const oldAppenderCount = internalLogger.getEffectiveAppenders().length;

				loggingService.configure(config);

				const newAppenderCount = internalLogger.getEffectiveAppenders().length;
				expect(newAppenderCount).toBe(oldAppenderCount + 1);
			});

			it("throws error if localStorageAppender has an invalid log level", () => {

				const config: LoggingConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage",
						logLevel: "xxx"
					}
				};

				try {
					loggingService.configure(config);
					fail("no error thrown");
				} catch (e) {
					expect(e).toBe("invalid log level xxx");
				}
			});

			it("localStorageAppender has default log level of WARN", () => {

				const config: LoggingConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage"
					}
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				const localStorageAppender = <LocalStorageAppender>internalLogger.getEffectiveAppenders()[2];

				expect(localStorageAppender.getThreshold()).toBe(log4javascript.Level.WARN);
			});

			it("localStorageAppender has given log level", () => {

				const config: LoggingConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage",
						logLevel: "INFO"
					}
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				const localStorageAppender = <LocalStorageAppender>internalLogger.getEffectiveAppenders()[2];

				expect(localStorageAppender.getThreshold()).toBe(log4javascript.Level.INFO);
			});

			it("localStorageAppender has default max messages of 250", () => {

				const config: LoggingConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage"
					}
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				const localStorageAppender = <LocalStorageAppender>internalLogger.getEffectiveAppenders()[2];

				expect(localStorageAppender.maxLogMessagesLength).toBe(250);
			});

			it("localStorageAppender has given max messages", () => {

				const config: LoggingConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage",
						maxMessages: 1234
					}
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				const localStorageAppender = <LocalStorageAppender>internalLogger.getEffectiveAppenders()[2];

				expect(localStorageAppender.maxLogMessagesLength).toBe(1234);
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

			loggingService.getRootLogger().warn("test");
			const messages = loggingService.getLogMessages();

			expect(messages.length).toBe(1);
		});
	});

	describe("logMessagesChanged: EventEmitter<LogMessage>", () => {

		it("logged messages are emitted", (done: () => void) => {
			loggingService.logMessagesChanged.subscribe((message: LogMessage) => {
				expect(message).toBe(loggingService.getLogMessages()[0]);
				done();
			});

			loggingService.getRootLogger().warn("test");
		});
	});

});
