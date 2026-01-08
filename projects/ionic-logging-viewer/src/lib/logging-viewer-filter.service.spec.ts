import { TestBed } from "@angular/core/testing";

import { LoggingService } from "ionic-logging-service";

import { LoggingViewerFilterService } from "./logging-viewer-filter.service";

describe("LoggingViewerFilterService", () => {

	let loggingViewerFilterService: LoggingViewerFilterService;

	const loggerStub = jasmine.createSpyObj("logger", ["entry", "exit"]);
	const loggingServiceStub = jasmine.createSpyObj("loggingServiceStub",
		["getLogger"]);
	loggingServiceStub.getLogger.and.returnValue(loggerStub);

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: LoggingService, useValue: loggingServiceStub },
				LoggingViewerFilterService,
			],
		});
		loggingViewerFilterService = TestBed.inject(LoggingViewerFilterService);
	});

	describe("ctor()", () => {

		it("gets correct named logger", () => {

			expect(loggingServiceStub.getLogger).toHaveBeenCalledWith("Ionic.Logging.Viewer.Filter.Service");
		});
	});

	describe("level", () => {

		describe("get", () => {

			it("return DEBUG as default", () => {

				expect(loggingViewerFilterService.level()).toBe("DEBUG");
			});
		});

		describe("set", () => {

			it("get returns new value", () => {

				loggingViewerFilterService.level.set("INFO");
				expect(loggingViewerFilterService.level()).toBe("INFO");
			});
		});
	});

	describe("search", () => {

		describe("get", () => {

			it("return empty string as default", () => {

				expect(loggingViewerFilterService.search()).toBe("");
			});
		});

		describe("set", () => {

			it("get returns new value", () => {

				loggingViewerFilterService.search.set("abc");
				expect(loggingViewerFilterService.search()).toBe("abc");
			});
		});
	});

});
