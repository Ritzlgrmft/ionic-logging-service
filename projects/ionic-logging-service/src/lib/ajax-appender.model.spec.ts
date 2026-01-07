import * as log4javascript from "log4javascript";

import { AjaxAppenderConfiguration } from "./ajax-appender.configuration";
import { AjaxAppender } from "./ajax-appender.model";

describe("AjaxAppender", () => {

	let appender: AjaxAppender;

	beforeEach(() => {
		appender = new AjaxAppender({ url: "MyUrl" });
	});

	afterEach(() => {
		appender = undefined;
	});

	describe("ctor", () => {

		it("throws error if no configuration is passed", () => {

			expect(() => new AjaxAppender(undefined)).
				toThrowError("configuration must be not empty");
		});

		describe("url", () => {
			it("throws error if configuration contains no url", () => {

				expect(() => new AjaxAppender({} as AjaxAppenderConfiguration)).
					toThrowError("url must be not empty");
			});

			it("throws error if configuration contains empty url", () => {

				expect(() => new AjaxAppender({ url: "" })).
					toThrowError("url must be not empty");
			});
		});

		describe("threshold", () => {
			it("uses default value if not specified", () => {

				const config: AjaxAppenderConfiguration = {
					url: "MyUrl",
				};

				const appender2 = new AjaxAppender(config);

				expect(appender2.getThreshold()).toBe(log4javascript.Level.WARN);
			});

			it("uses value from configuration", () => {

				const config: AjaxAppenderConfiguration = {
					threshold: "INFO",
					url: "MyUrl",
				};

				const appender2 = new AjaxAppender(config);

				expect(appender2.getThreshold()).toBe(log4javascript.Level.INFO);
			});

			it("throws an error if value from configuration is invalid", () => {

				const config: AjaxAppenderConfiguration = {
					threshold: "abc",
					url: "MyUrl",
				};

				expect(() => new AjaxAppender(config)).toThrowError("invalid level abc");
			});
		});
	});

	describe("configure(configuration: AjaxAppenderConfiguration): void", () => {

		it("throws no error if no configuration is provided", () => {

			const config: AjaxAppenderConfiguration = undefined;
			expect(() => appender.configure(config)).not.toThrow();
		});

		describe("url", () => {
			it("throws error if modified", () => {

				const config: AjaxAppenderConfiguration = {
					url: "MyUrl2",
				};

				expect(() => appender.configure(config)).toThrowError("url must not be changed");
			});
		});

		describe("withCredentials", () => {
			it("throws error if modified", () => {

				const config: AjaxAppenderConfiguration = {
					url: "MyUrl",
					withCredentials: true
				};

				expect(() => appender.configure(config)).toThrowError("withCredentials must not be changed");
			});
		});

		describe("threshold", () => {
			it("uses default value if undefined", () => {

				const config: AjaxAppenderConfiguration = {
					url: "MyUrl",
				};

				appender.configure(config);

				expect(appender.getThreshold()).toBe(log4javascript.Level.WARN);
			});

			it("uses given value if defined", () => {

				const config: AjaxAppenderConfiguration = {
					threshold: "INFO",
					url: "MyUrl",
				};

				appender.configure(config);

				expect(appender.getThreshold()).toBe(log4javascript.Level.INFO);
			});

			it("throws error if given value is undefined", () => {

				const config: AjaxAppenderConfiguration = {
					threshold: "abc",
					url: "MyUrl",
				};

				expect(() => appender.configure(config)).toThrowError("invalid level abc");
			});
		});
	});

	describe("appenderFailed: lastFailure set", () => {

		it("event gets triggered with invalid url", (done) => {
			log4javascript.logLog.setQuietMode(true);
			const logger = log4javascript.getLogger("test");
			const event = new log4javascript.LoggingEvent(logger, new Date(), log4javascript.Level.INFO, ["1"]);

			appender.append(event);

			// Wait for the asynchronous failure callback
			setTimeout(() => {
				const lastFailure = appender.getLastFailure()();
				expect(lastFailure).toBe("AjaxAppender.append: XMLHttpRequest request to URL MyUrl returned status code 404");
				done();
			}, 100);
		});

	});

	describe("toString(): string", () => {

		it("returns logical type name", () => {

			const text = appender.toString();

			expect(text).toBe("Ionic.Logging.AjaxAppender");
		});
	});

	describe("getLayout(): log4javascript.Layout", () => {
		it("uses default value if undefined", () => {

			expect(appender.getLayout().toString()).toBe("Ionic.Logging.JsonLayout");
		});

		it("uses given value if defined", () => {

			const layout = new log4javascript.Layout();
			appender.setLayout(layout);

			expect(appender.getLayout()).toBe(layout);
		});
	});
});
