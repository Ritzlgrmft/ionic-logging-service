import { afterEach, describe, it, expect, beforeEach } from "vitest";

import * as log4javascript from "log4javascript";

import { LocalStorageAppenderConfiguration } from "./local-storage-appender.configuration";
import { LocalStorageAppender } from "./local-storage-appender.model";

describe("LocalStorageAppender", () => {

	let appender: LocalStorageAppender;

	beforeEach(() => {
		appender = new LocalStorageAppender({ localStorageKey: "MyLocalStorage" });
		appender.clearLog();
	});

	afterEach(() => {
		appender.clearLog();
		appender = undefined;
	});

	describe("ctor", () => {

		it("reads already stored messages", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, []);
			appender.append(event);

			const appender2 = new LocalStorageAppender({ localStorageKey: "MyLocalStorage" });
			const messages = appender2.getLogMessages();
			expect(messages.length).toBe(1);
			expect(messages[0].timeStamp).toEqual(event.timeStamp);
			expect(messages[0].level).toBe(event.level.toString());
		});

		it("throws error if no configuration is passed", () => {

			expect(() => new LocalStorageAppender(undefined)).
				toThrowError("configuration must be not empty");
		});

		describe("localStorageKey", () => {
			it("throws error if configuration contains no localStorageKey", () => {

				expect(() => new LocalStorageAppender({} as LocalStorageAppenderConfiguration)).
					toThrowError("localStorageKey must be not empty");
			});

			it("throws error if configuration contains empty localStorageKey", () => {

				expect(() => new LocalStorageAppender({ localStorageKey: "" })).
					toThrowError("localStorageKey must be not empty");
			});

			it("uses value from configuration", () => {
				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage2",
				};

				const appender2 = new LocalStorageAppender(config);

				expect(appender2.getLocalStorageKey()).toBe("MyLocalStorage2");
			});
		});

		describe("maxMessages", () => {
			it("uses default value if not specified", () => {

				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage",
				};

				const appender2 = new LocalStorageAppender(config);

				expect(appender2.getMaxMessages()).toBe(250);
			});

			it("uses value from configuration", () => {

				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage",
					maxMessages: 42,
				};

				const appender2 = new LocalStorageAppender(config);

				expect(appender2.getMaxMessages()).toBe(42);
			});
		});

		describe("threshold", () => {
			it("uses default value if not specified", () => {

				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage",
				};

				const appender2 = new LocalStorageAppender(config);

				expect(appender2.getThreshold()).toBe(log4javascript.Level.WARN);
			});

			it("uses value from configuration", () => {

				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage",
					threshold: "INFO",
				};

				const appender2 = new LocalStorageAppender(config);

				expect(appender2.getThreshold()).toBe(log4javascript.Level.INFO);
			});

			it("throws an error if value from configuration is invalid", () => {

				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage",
					threshold: "abc",
				};

				expect(() => new LocalStorageAppender(config)).toThrowError("invalid level abc");
			});
		});
	});

	describe("configure(configuration: LocalStorageAppenderConfiguration): void", () => {

		it("throws no error if no configuration is provided", () => {

			const config: LocalStorageAppenderConfiguration = undefined;
			expect(() => appender.configure(config)).not.toThrow();
		});

		describe("localStorageKey", () => {
			it("throws error if modified", () => {

				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage2",
				};

				expect(() => appender.configure(config)).toThrowError("localStorageKey must not be changed");
			});
		});

		describe("maxMessages", () => {
			it("uses default value if undefined", () => {

				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage",
				};

				appender.configure(config);

				expect(appender.getMaxMessages()).toBe(250);
			});

			it("uses given value if defined", () => {

				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage",
					maxMessages: 42,
				};

				appender.configure(config);

				expect(appender.getMaxMessages()).toBe(42);
			});
		});

		describe("threshold", () => {
			it("uses default value if undefined", () => {

				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage",
				};

				appender.configure(config);

				expect(appender.getThreshold()).toBe(log4javascript.Level.WARN);
			});

			it("uses given value if defined", () => {

				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage",
					threshold: "INFO",
				};

				appender.configure(config);

				expect(appender.getThreshold()).toBe(log4javascript.Level.INFO);
			});

			it("throws error if given value is undefined", () => {

				const config: LocalStorageAppenderConfiguration = {
					localStorageKey: "MyLocalStorage",
					threshold: "abc",
				};

				expect(() => appender.configure(config)).toThrowError("invalid level abc");
			});
		});
	});

	describe("append(loggingEvent: log4javascript.LoggingEvent): void", () => {

		it("writes message to messages array", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, []);

			appender.append(event);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(1);
			expect(messages[0].timeStamp).toBe(event.timeStamp);
			expect(messages[0].level).toBe(event.level.toString());
		});

		it("writes message to end of messages array", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["2"]);

			appender.append(event);
			appender.append(event2);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(2);
			expect(messages[0].methodName).toBe("1");
			expect(messages[1].methodName).toBe("2");
		});

		it("removes first message if array contains already maxMessages messages", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["2"]);
			const event3 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["3"]);

			appender.setMaxMessages(2);
			appender.append(event);
			appender.append(event2);
			appender.append(event3);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(2);
			expect(messages[0].methodName).toBe("2");
			expect(messages[1].methodName).toBe("3");
		});

		it("uses logger name from event if defined", () => {

			const logger = log4javascript.getLogger("MyLogger");
			const event = new log4javascript.LoggingEvent(logger, new Date(), log4javascript.Level.INFO, ["1"]);

			appender.append(event);

			const messages = appender.getLogMessages();
			expect(messages[0].logger).toBe("MyLogger");
		});

		it("uses undefined as logger name if not defined in event", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);

			appender.append(event);

			const messages = appender.getLogMessages();
			expect(messages[0].logger).toBeUndefined();
		});

		it("method not called if threshold is higher than log level", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);

			appender.setThreshold(log4javascript.Level.WARN);
			appender.doAppend(event);

			let messages = appender.getLogMessages();
			expect(messages.length).toBe(0);

			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.WARN, ["1"]);
			appender.doAppend(event2);

			messages = appender.getLogMessages();
			expect(messages.length).toBe(1);
		});
	});

	describe("toString(): string", () => {

		it("returns logical type name", () => {

			const text = appender.toString();

			expect(text).toBe("Ionic.Logging.LocalStorageAppender");
		});
	});

	describe("getLocalStorageKey(): string", () => {

		it("return set value", () => {

			const localStorageKey = appender.getLocalStorageKey();

			expect(localStorageKey).toBe("MyLocalStorage");
		});
	});

	describe("getMaxMessages(): number", () => {

		it("return set value", () => {

			appender.setMaxMessages(42);
			const maxMessages = appender.getMaxMessages();

			expect(maxMessages).toBe(42);
		});
	});

	describe("setMaxMessages(value: number): void", () => {

		it("remove spare messages", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["2"]);
			const event3 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["3"]);

			appender.append(event);
			appender.append(event2);
			appender.append(event3);

			let messages = appender.getLogMessages();
			expect(messages.length).toBe(3);

			appender.setMaxMessages(1);

			messages = appender.getLogMessages();
			expect(messages.length).toBe(1);
			expect(messages[0].methodName).toBe("3");
		});

		it("same value does not change anything", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["2"]);
			const event3 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["3"]);

			appender.append(event);
			appender.append(event2);
			appender.append(event3);

			let messages = appender.getLogMessages();
			expect(messages.length).toBe(3);

			appender.setMaxMessages(250);

			messages = appender.getLogMessages();
			expect(messages.length).toBe(3);
			expect(appender.getMaxMessages()).toBe(250);
		});
	});

	describe("removeLogMessages(localeStorageKey: string): void", () => {

		it("messages from localStorage removed", async () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			appender.append(event);
			await expect(localStorage.getItem(appender.getLocalStorageKey())).toBeDefined();

			LocalStorageAppender.removeLogMessages(appender.getLocalStorageKey());
			await expect(localStorage.getItem(appender.getLocalStorageKey())).toBeNull();
		});
	});
});
