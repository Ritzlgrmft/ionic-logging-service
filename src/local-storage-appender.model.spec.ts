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

	describe("append(loggingEvent: log4javascript.LoggingEvent): void", () => {

		it("writes message to messages array", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, []);

			appender.append(event);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(1);
			expect(messages[0].timeStamp).toBe(event.timeStamp);
			expect(messages[0].level).toBe(event.level.toString());
		});

		it("writes message to end of messages array if isInsertAtTop===false", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["2"]);

			appender.isInsertAtTop = false;
			appender.append(event);
			appender.append(event2);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(2);
			expect(messages[0].methodName).toBe("1");
			expect(messages[1].methodName).toBe("2");
		});

		it("writes message to begin of messages array if isInsertAtTop===true", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["2"]);

			appender.isInsertAtTop = true;
			appender.append(event);
			appender.append(event2);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(2);
			expect(messages[0].methodName).toBe("2");
			expect(messages[1].methodName).toBe("1");
		});

		it("removes first message if isInsertAtTop===false and array contains already maxLogMessagesLength messages", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["2"]);
			const event3 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["3"]);

			appender.isInsertAtTop = false;
			appender.maxLogMessagesLength = 2;
			appender.append(event);
			appender.append(event2);
			appender.append(event3);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(2);
			expect(messages[0].methodName).toBe("2");
			expect(messages[1].methodName).toBe("3");
		});

		it("removes last message if isInsertAtTop===true and array contains already maxLogMessagesLength messages", () => {

			const event = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["1"]);
			const event2 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["2"]);
			const event3 = new log4javascript.LoggingEvent(undefined, new Date(), log4javascript.Level.INFO, ["3"]);

			appender.isInsertAtTop = true;
			appender.maxLogMessagesLength = 2;
			appender.append(event);
			appender.append(event2);
			appender.append(event3);

			const messages = appender.getLogMessages();
			expect(messages.length).toBe(2);
			expect(messages[0].methodName).toBe("3");
			expect(messages[1].methodName).toBe("2");
		});
	});

	describe("toString(): string", () => {

		it("returns logical type name", () => {

			const text = appender.toString();

			expect(text).toBe("Ionic.Logging.LocalStorageAppender");
		});
	});

});