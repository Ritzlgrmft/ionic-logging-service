// tslint:disable:no-magic-numbers
import * as log4javascript from "log4javascript";

import { LocalStorageAppender } from "./local-storage-appender.model";

describe("LocalStorageAppender", () => {

	let appender: LocalStorageAppender;

	beforeEach(() => {
		appender = new LocalStorageAppender("MyLocalStorage");
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

			const appender2 = new LocalStorageAppender("MyLocalStorage");
			const messages = appender2.getLogMessages();
			expect(messages.length).toBe(1);
			expect(messages[0].timeStamp).toEqual(event.timeStamp);
			expect(messages[0].level).toBe(event.level.toString());
		});

		it("throws error if undefined is passed as localStorageKey", () => {

			expect(() => new LocalStorageAppender(undefined)).toThrowError("localStorageKey may be not empty");
		});

		it("throws error if null is passed as localStorageKey", () => {

			// tslint:disable-next-line:no-null-keyword
			expect(() => new LocalStorageAppender(null)).toThrowError("localStorageKey may be not empty");
		});

		it("throws error if empty string is passed as localStorageKey", () => {

			expect(() => new LocalStorageAppender("")).toThrowError("localStorageKey may be not empty");
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

		it("removes first message if array contains already maxLogMessagesLength messages", () => {

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

});