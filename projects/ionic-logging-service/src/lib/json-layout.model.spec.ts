// tslint:disable:no-magic-numbers
import * as log4javascript from "log4javascript";

import { JsonLayout } from "./json-layout.model";

describe("JsonLayout", () => {

	let layout: JsonLayout;

	beforeEach(() => {
		layout = new JsonLayout();
	});

	describe("ctor", () => {

		it("combineMessage false", () => {

			layout = new JsonLayout(false, false);

			expect(layout.isCombinedMessages()).toBeFalse();
		});

		it("combineMessage true", () => {

			layout = new JsonLayout(false, true);

			expect(layout.isCombinedMessages()).toBeTrue();
		});

		it("combineMessage not specified", () => {

			layout = new JsonLayout();

			expect(layout.isCombinedMessages()).toBeTrue();
		});
	});

	describe("format", () => {

		it("format standard message", () => {

			log4javascript.logLog.setQuietMode(true);
			const logger = log4javascript.getLogger("test");
			const event = new log4javascript.LoggingEvent(logger, new Date(), log4javascript.Level.INFO, ["1"]);

			const formattedMessage = layout.format(event);

			const originalLayout = new log4javascript.JsonLayout();
			const originalFormattedMessage = originalLayout.format(event);

			expect(formattedMessage).toBe(originalFormattedMessage);
		});

		it("format message with escaped quote", () => {

			log4javascript.logLog.setQuietMode(true);
			const logger = log4javascript.getLogger("test");
			const event = new log4javascript.LoggingEvent(logger, new Date(), log4javascript.Level.INFO, ["1\\\"2"]);

			const formattedMessage = layout.format(event);

			const transformedEvent = JSON.parse(formattedMessage);
			expect(transformedEvent.message).toBe(event.messages[0]);
		});

		it("format message without combine message", () => {

			log4javascript.logLog.setQuietMode(true);
			const logger = log4javascript.getLogger("test");
			const event = new log4javascript.LoggingEvent(logger, new Date(), log4javascript.Level.INFO, ["12"]);

			layout = new JsonLayout(false, false);
			const formattedMessage = layout.format(event);

			const transformedEvent = JSON.parse(formattedMessage);
			expect(transformedEvent.message[0]).toBe(event.messages[0]);
		});

	});

	describe("toString(): string", () => {

		it("returns logical type name", () => {

			const text = layout.toString();

			expect(text).toBe("Ionic.Logging.JsonLayout");
		});
	});


});
