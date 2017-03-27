// tslint:disable:no-magic-numbers
import * as log4javascript from "log4javascript";

import { MemoryAppender } from "./memory-appender.model";

describe("MemoryAppender", () => {

	describe("append(loggingEvent: log4javascript.LoggingEvent): void", () => {

		it("triggers onLogMessagesChangedCallback callback", () => {

			const onLogMessagesChangedCallback = jasmine.createSpy("onLogMessagesChangedCallback");
			const appender = new MemoryAppender();
			appender.setOnLogMessagesChangedCallback(onLogMessagesChangedCallback);

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, []);

			appender.append(event);

			expect(onLogMessagesChangedCallback).toHaveBeenCalledWith(appender.getLogMessages()[0]);
		});

		it("writes message to messages array", () => {

			const appender = new MemoryAppender();

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, []);

			appender.append(event);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(1);
			expect(messages[0].timeStamp).toBe(event.timeStamp);
			expect(messages[0].level).toBe(event.level.toString());
		});

		it("writes message to end of messages array", () => {

			const appender = new MemoryAppender();

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["2"]);

			appender.append(event);
			appender.append(event2);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(2);
			expect(messages[0].methodName).toBe("1");
			expect(messages[1].methodName).toBe("2");
		});

		it("removes first message if array contains already maxLogMessagesLength messages", () => {

			const appender = new MemoryAppender();

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["2"]);
			const event3 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["3"]);

			appender.maxLogMessagesLength = 2;
			appender.append(event);
			appender.append(event2);
			appender.append(event3);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(2);
			expect(messages[0].methodName).toBe("2");
			expect(messages[1].methodName).toBe("3");
		});

		it("uses logger name from event if defined", () => {

			const appender = new MemoryAppender();

			const logger = log4javascript.getLogger("MyLogger");
			const event = new log4javascript.LoggingEvent(logger, new Date(), log4javascript.Level.INFO, ["1"]);

			appender.append(event);

			const messages = appender.getLogMessages();
			expect(messages[0].logger).toBe("MyLogger");
		});

		it("uses undefined as logger name if not defined in event", () => {

			const appender = new MemoryAppender();

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);

			appender.append(event);

			const messages = appender.getLogMessages();
			expect(messages[0].logger).toBeUndefined();
		});
	});

	describe("toString(): string", () => {

		it("returns logical type name", () => {

			const appender = new MemoryAppender();
			const text = appender.toString();

			expect(text).toBe("Ionic.Logging.MemoryAppender");
		});
	});
});
