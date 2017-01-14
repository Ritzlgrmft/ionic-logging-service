// tslint:disable:no-magic-numbers
import { inject, TestBed } from "@angular/core/testing";
import { BaseRequestOptions, Http, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";

import * as log4javascript from "log4javascript";

import { ConfigurationService } from "ionic-configuration-service";

import { LocalStorageAppender } from "./local-storage-appender.model";
import { Logger } from "./logger.model";
import { LoggingConfiguration } from "./logging-configuration.model";
import { LogMessage } from "./log-message.model";
import { LoggingService } from "./logging.service";
import { MemoryAppender } from "./memory-appender.model";

describe("LoggingService", () => {

	let configurationService: ConfigurationService;
	let loggingService: LoggingService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ConfigurationService,
				LoggingService,
				BaseRequestOptions,
				MockBackend,
				{
					provide: Http,
					useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
						return new Http(backend, defaultOptions);
					},
					deps: [MockBackend, BaseRequestOptions]
				}
			]
		});
	});

	beforeEach(inject([MockBackend], (backend: MockBackend) => {
		const emptyResponse = new Response(new ResponseOptions({
			body: "{ }",
			status: 200
		}));
		backend.connections.subscribe((c: MockConnection) => {
			if (c.request.url.endsWith("empty.json")) {
				c.mockRespond(emptyResponse);
			}
		});
	}));

	beforeEach(inject([ConfigurationService],
		(_configurationService: ConfigurationService) => {
			configurationService = _configurationService;
		}));

	beforeEach(inject([LoggingService],
		(_loggingService: LoggingService) => {
			loggingService = _loggingService;
		}));

	afterEach(() => {
		log4javascript.resetConfiguration();
		log4javascript.getRootLogger().removeAllAppenders();
	});

	describe("ctor()", () => {

		it("root logger has log level WARN", done => {

			configurationService.load("empty.json").then(() => {
				loggingService.getRootLogger().info("test");
				loggingService.getRootLogger().warn("test");
				const messages = loggingService.getLogMessages();

				expect(messages.length).toBe(1);
				done();
			});
		});
	});

	describe("configure(configuration: LoggingConfiguration): void", () => {

		it("throws no error if no configuration is provided", () => {

			loggingService.configure(undefined);
		});

		it("throws no error if configuration is empty", () => {

			const config: LoggingConfiguration = {};
			loggingService.configure(config);
		});

		describe("logLevels", () => {
			it("throws no error if logLevels is empty", () => {

				const logLevels: { loggerName: string; logLevel: string; }[] = [];
				const config: LoggingConfiguration = {
					logLevels: logLevels
				};

				loggingService.configure(config);
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

				expect(() => loggingService.configure(config)).toThrowError("invalid log level xxx");
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

			it("throws error if ajaxAppender has an invalid threshold", () => {

				const config: LoggingConfiguration = {
					ajaxAppender: {
						url: "myUrl",
						threshold: "xxx"
					}
				};

				expect(() => loggingService.configure(config)).toThrowError("invalid threshold xxx");
			});

			it("ajaxAppender has default threshold of ALL", () => {

				const config: LoggingConfiguration = {
					ajaxAppender: {
						url: "myUrl"
					}
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				const ajaxAppender = <log4javascript.AjaxAppender>internalLogger.getEffectiveAppenders()[2];

				expect(ajaxAppender.getThreshold()).toBe(log4javascript.Level.ALL);
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

			it("throws error if localStorageAppender has an invalid threshold", () => {

				const config: LoggingConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage",
						threshold: "xxx"
					}
				};

				expect(() => loggingService.configure(config)).toThrowError("invalid threshold xxx");
			});

			it("localStorageAppender has default threshold of WARN", () => {

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

			it("localStorageAppender has given threshold", () => {

				const config: LoggingConfiguration = {
					localStorageAppender: {
						localStorageKey: "myLocalStorage",
						threshold: "INFO"
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

		describe("memoryAppender", () => {
			it("memoryAppender has default max messages of 250", () => {

				const config: LoggingConfiguration = {
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				const memoryAppender = <MemoryAppender>internalLogger.getEffectiveAppenders()[1];

				expect(memoryAppender.maxLogMessagesLength).toBe(250);
			});

			it("memoryAppender has default configuration id memoryAppender configuration is empty", () => {

				const config: LoggingConfiguration = {
					memoryAppender: {}
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				const memoryAppender = <MemoryAppender>internalLogger.getEffectiveAppenders()[1];

				expect(memoryAppender.maxLogMessagesLength).toBe(250);
			});

			it("memoryAppender has given max messages", () => {

				const config: LoggingConfiguration = {
					memoryAppender: {
						maxMessages: 1234
					}
				};

				loggingService.configure(config);
				const internalLogger = new Logger().getInternalLogger();
				const memoryAppender = <MemoryAppender>internalLogger.getEffectiveAppenders()[1];

				expect(memoryAppender.maxLogMessagesLength).toBe(1234);
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

	describe("ajaxAppenderFailed: EventEmitter<string>", () => {

		it("error message emitted", (done: () => void) => {
			const config: LoggingConfiguration = {
				ajaxAppender: {
					url: "badUrl"
				}
			};
			loggingService.configure(config);

			loggingService.ajaxAppenderFailed.subscribe((message: string) => {
				expect(message).toBe("AjaxAppender.append: XMLHttpRequest request to URL badUrl returned status code 404");
				done();
			});

			loggingService.getRootLogger().warn("test");
		});
	});

});
