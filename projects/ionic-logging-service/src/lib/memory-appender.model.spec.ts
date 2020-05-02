// tslint:disable:no-magic-numbers
import * as log4javascript from "log4javascript";

import { MemoryAppenderConfiguration } from "./memory-appender.configuration";
import { MemoryAppender } from "./memory-appender.model";

describe("MemoryAppender", () => {

	let appender: MemoryAppender;

	beforeEach(() => {
		appender = new MemoryAppender();
	});

	describe("configure(configuration: MemoryAppenderConfiguration): void", () => {

		it("throws no error if no configuration is provided", () => {

			const config: MemoryAppenderConfiguration = undefined;
			appender.configure(config);
		});

		it("throws no error if configuration is empty", () => {

			const config: MemoryAppenderConfiguration = {};
			appender.configure(config);
		});

		describe("maxMessages", () => {
			it("uses default value if undefined", () => {

				const config: MemoryAppenderConfiguration = {};

				appender.configure(config);

				expect(appender.getMaxMessages()).toBe(250);
			});

			it("uses given value if defined", () => {

				const config: MemoryAppenderConfiguration = {
					maxMessages: 42,
				};

				appender.configure(config);

				expect(appender.getMaxMessages()).toBe(42);
			});
		});

		describe("threshold", () => {
			it("uses default value if undefined", () => {

				const config: MemoryAppenderConfiguration = {};

				appender.configure(config);

				expect(appender.getThreshold()).toBe(log4javascript.Level.ALL);
			});

			it("uses given value if defined", () => {

				const config: MemoryAppenderConfiguration = {
					threshold: "WARN",
				};

				appender.configure(config);

				expect(appender.getThreshold()).toBe(log4javascript.Level.WARN);
			});

			it("throws error if given value is undefined", () => {

				const config: MemoryAppenderConfiguration = {
					threshold: "abc",
				};

				expect(() => appender.configure(config)).toThrowError("invalid level abc");
			});
		});
	});

	describe("append(loggingEvent: log4javascript.LoggingEvent): void", () => {

		it("triggers onLogMessagesChangedCallback callback", () => {

			const onLogMessagesChangedCallback = jasmine.createSpy("onLogMessagesChangedCallback");
			appender.setOnLogMessagesChangedCallback(onLogMessagesChangedCallback);

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, []);

			appender.append(event);

			expect(onLogMessagesChangedCallback).toHaveBeenCalledWith(appender.getLogMessages()[0]);
		});

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
	});

	describe("toString(): string", () => {

		it("returns logical type name", () => {

			const text = appender.toString();

			expect(text).toBe("Ionic.Logging.MemoryAppender");
		});
	});

	describe("getMaxMessages(): number", () => {

		it("return set value", () => {

			appender.setMaxMessages(42);
			const maxMessages = appender.getMaxMessages();

			expect(maxMessages).toBe(42);
		});

		it("default value", () => {

			const maxMessages = appender.getMaxMessages();

			expect(maxMessages).toBe(250);
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
	});

	describe("getThreshold(): log4javascript.Level", () => {

		it("default value", () => {

			const threshold = appender.getThreshold();

			expect(threshold).toBe(log4javascript.Level.ALL);
		});
	});

	describe("setThreshold(level: log4javascript.Level): void", () => {

		it("log only messages with appropriate level", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.DEBUG, ["2"]);
			const event3 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.WARN, ["3"]);

			appender.setThreshold(log4javascript.Level.INFO);
			appender.doAppend(event);
			appender.doAppend(event2);
			appender.doAppend(event3);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(2);

			expect(messages[0].methodName).toBe("1");
			expect(messages[1].methodName).toBe("3");
		});
	});

	describe("removeLogMessages(): void", () => {

		it("messages removed", async () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			appender.append(event);
			await expect(appender.getLogMessages().length).toBe(1);

			appender.removeLogMessages();
			await expect(appender.getLogMessages().length).toBe(0);
		});
	});
});
