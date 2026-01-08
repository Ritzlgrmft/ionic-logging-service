import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { LoggingService, LogMessage } from "ionic-logging-service";

import { LoggingViewerComponent } from "./logging-viewer.component";

describe("LoggingViewerComponent", () => {

	let component: LoggingViewerComponent;
	let fixture: ComponentFixture<LoggingViewerComponent>;
	const logMessages = signal<LogMessage[]>([]);
	const logMessagesFromLocalStorage: LogMessage[] = [];

	const loggerStub = jasmine.createSpyObj("logger", ["entry", "exit"]);

	const loggingServiceStub = jasmine.createSpyObj("loggingServiceStub",
		["getLogger", "getLogMessages", "getLogMessagesFromLocalStorage"]);
	loggingServiceStub.getLogger.and.returnValue(loggerStub);
	loggingServiceStub.getLogMessages.and.returnValue(logMessages);
	loggingServiceStub.getLogMessagesFromLocalStorage.and.returnValue(logMessagesFromLocalStorage);

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				IonicModule,
				LoggingViewerComponent,
			],
			providers: [
				{ provide: LoggingService, useValue: loggingServiceStub }
			],
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LoggingViewerComponent);
		fixture.detectChanges();

		component = fixture.componentInstance;
	});

	describe("constructor", () => {

		it("gets correct named logger", () => {

			expect(loggingServiceStub.getLogger).toHaveBeenCalledWith("Ionic.Logging.Viewer.Component");
		});

	});

	describe("filterLogMessages", () => {

		it("level INFO, search empty", () => {

			const messages = [
				{
					level: "DEBUG",
					logger: "myLogger",
					message: ["myMessage"],
					methodName: "myMethod",
					timeStamp: new Date(),
				}, {
					level: "INFO",
					logger: "myLogger",
					message: ["myMessage", "xxx"],
					methodName: "myMethod",
					timeStamp: new Date(),
				}, {
					level: "INFO",
					logger: "myLogger",
					message: ["myMessage"],
					methodName: "myMethod",
					timeStamp: new Date(),
				}];

			component.filterLogMessages(messages, "INFO", "");

			expect(component.logMessagesForDisplay.length).toBe(2);
		});
	});

	describe("filterLogMessagesByLevel", () => {

		it("message with same level returns true", () => {

			const logMessage = {
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			};

			const result = component.filterLogMessagesByLevel(logMessage, "DEBUG");

			expect(result).toBeTruthy();
		});

		it("message with higher level returns true", () => {

			const logMessage = {
				level: "INFO",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			};

			const result = component.filterLogMessagesByLevel(logMessage, "DEBUG");

			expect(result).toBeTruthy();
		});

		it("message with lower level returns true", () => {

			const logMessage = {
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			};

			const result = component.filterLogMessagesByLevel(logMessage, "INFO");

			expect(result).toBeFalsy();
		});
	});

	describe("filterLogMessagesBySearch", () => {

		it("search value is empty returns true", () => {

			const logMessage = {
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			};

			const result = component.filterLogMessagesBySearch(logMessage, "");

			expect(result).toBeTruthy();
		});

		it("logger contains search value returns true", () => {

			const logMessage = {
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			};

			const result = component.filterLogMessagesBySearch(logMessage, "yLog");

			expect(result).toBeTruthy();
		});

		it("logger contains search value with different casing returns true", () => {

			const logMessage = {
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			};

			const result = component.filterLogMessagesBySearch(logMessage, "ylog");

			expect(result).toBeTruthy();
		});

		it("methodName contains search value returns true", () => {

			const logMessage = {
				level: "INFO",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			};

			const result = component.filterLogMessagesBySearch(logMessage, "yMeth");

			expect(result).toBeTruthy();
		});

		it("methodName contains search value with different casing returns true", () => {

			const logMessage = {
				level: "INFO",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			};

			const result = component.filterLogMessagesBySearch(logMessage, "ymeth");

			expect(result).toBeTruthy();
		});

		it("message contains search value returns true", () => {

			const logMessage = {
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			};

			const result = component.filterLogMessagesBySearch(logMessage, "yMes");

			expect(result).toBeTruthy();
		});

		it("message contains search value with different casing returns true", () => {

			const logMessage = {
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			};

			const result = component.filterLogMessagesBySearch(logMessage, "ymes");

			expect(result).toBeTruthy();
		});

		it("nothing contains search value returns false", () => {

			const logMessage = {
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			};

			const result = component.filterLogMessagesBySearch(logMessage, "xxx");

			expect(result).toBeFalsy();
		});
	});

	describe("localStorageKeys", () => {

		it("local storage empty no log messages", () => {

			fixture.componentRef.setInput("localStorageKeys", "xxx");
			fixture.detectChanges();

			logMessagesFromLocalStorage.splice(0, logMessagesFromLocalStorage.length);
			logMessages.set([{
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			}]);
			component.filterLogMessages(logMessagesFromLocalStorage, "DEBUG", "");

			expect(component.logMessagesForDisplay.length).toBe(0);
		});

		it("local storage with log messages", () => {

			fixture.componentRef.setInput("localStorageKeys", "xxx");
			fixture.detectChanges();

			logMessagesFromLocalStorage.splice(0, logMessagesFromLocalStorage.length);
			logMessagesFromLocalStorage.push({
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage"],
				methodName: "myMethod",
				timeStamp: new Date(),
			});
			logMessagesFromLocalStorage.push({
				level: "DEBUG",
				logger: "myLogger",
				message: ["myMessage2"],
				methodName: "myMethod",
				timeStamp: new Date(),
			});
			component.filterLogMessages(logMessagesFromLocalStorage, "DEBUG", "");

			expect(component.logMessagesForDisplay.length).toBe(2);
		});
	});
});
