import { EventEmitter, signal, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { IonicModule, NavParams, AlertController, AngularDelegate } from "@ionic/angular";

import { LogMessage, LoggingService } from "ionic-logging-service";

import { LoggingViewerModalComponent } from "./logging-viewer-modal.component";
import { LoggingViewerFilterService } from "../logging-viewer-filter.service";

describe("LoggingViewerModalComponent", () => {
	let component: LoggingViewerModalComponent;
	let fixture: ComponentFixture<LoggingViewerModalComponent>;

	const loggerStub = jasmine.createSpyObj("logger", ["debug", "entry", "exit", "info"]);

	const loggingServiceEventEmitter = new EventEmitter<LogMessage>();
	const loggingServiceStub = jasmine.createSpyObj("loggingServiceStub",
		["getLogger", "getLogMessages", "removeLogMessages", "removeLogMessagesFromLocalStorage"]);
	loggingServiceStub.getLogger.and.returnValue(loggerStub);
	loggingServiceStub.getLogMessages.and.returnValue([]);
	loggingServiceStub.logMessagesChanged = loggingServiceEventEmitter;

	const alertStub = jasmine.createSpyObj("alert", ["present"]);
	const alertControllerStub = jasmine.createSpyObj("alertControllerStub", ["create"]);
	alertControllerStub.create.and.returnValue(Promise.resolve(alertStub));

	const navParamsStub = jasmine.createSpyObj("navParams", ["get"]);
	navParamsStub.get.and.returnValue(undefined);

	const angularDelegateStub = jasmine.createSpyObj("angularDelegateStub", ["create"]);

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [
				FormsModule,
				IonicModule,
				LoggingViewerModalComponent,
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: LoggingService, useValue: loggingServiceStub },
				{ provide: AlertController, useValue: alertControllerStub },
				{ provide: NavParams, useValue: navParamsStub },
				{ provide: AngularDelegate, useValue: angularDelegateStub },
				LoggingViewerFilterService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoggingViewerModalComponent);
		component = fixture.componentInstance;
	});

	afterEach(() => {
		fixture.destroy();
	});

	describe("constructor", () => {

		it("gets correct named logger", () => {

			expect(loggingServiceStub.getLogger).toHaveBeenCalledWith("Ionic.Logging.Viewer.Modal.Component");
		});

		it("logs entry and exit", () => {

			expect(loggerStub.entry).toHaveBeenCalledWith("ctor");
			expect(loggerStub.exit).toHaveBeenCalledWith("ctor");
		});
	});

	describe("ionViewDidEnter", () => {

		it("logs entry and exit", () => {

			component.ionViewDidEnter();

			expect(loggerStub.entry).toHaveBeenCalledWith("ionViewDidEnter");
			expect(loggerStub.exit).toHaveBeenCalledWith("ionViewDidEnter");
		});
	});

	describe("onClose(): void", () => {

		it("calls modalController.dismiss()", async () => {
			const dismissSpy = spyOn((component as any).modalController, 'dismiss').and.returnValue(Promise.resolve());

			await component.onClose();

			expect(dismissSpy).toHaveBeenCalled();
		});
	});

	describe("getTranslation(): LoggingViewerTranslation", () => {

		it("known language, no translation: title is translated", () => {

			fixture.componentRef.setInput("language", "de");
			fixture.componentRef.setInput("translation", undefined);

			component.ngOnInit();

			const translation = component.getTranslation();

			expect(translation.title).toBe("Logging");
		});

		it("unknown language, no translation: english translation is used", () => {

			fixture.componentRef.setInput("language", "fr");
			fixture.componentRef.setInput("translation", undefined);

			component.ngOnInit();

			const translation = component.getTranslation();

			expect(translation.title).toBe("Logging");
		});

		it("no language, no translation: english translation is used", () => {

			fixture.componentRef.setInput("language", undefined);
			fixture.componentRef.setInput("translation", undefined);

			component.ngOnInit();

			const translation = component.getTranslation();

			expect(translation.title).toBe("Logging");
		});

		it("no language, but translation: translation is used", () => {

			fixture.componentRef.setInput("language", undefined);
			fixture.componentRef.setInput("translation", { title: "ttt", cancel: "bc", searchPlaceholder: "sp", ok: "oo", confirmDelete: "cd" });

			component.ngOnInit();

			const translation = component.getTranslation();

			expect(translation.title).toBe("ttt");
		});

		it("language and translation: translation is used", () => {

			fixture.componentRef.setInput("language", "en");
			fixture.componentRef.setInput("translation", { title: "ttt", cancel: "bc", searchPlaceholder: "sp", ok: "oo", confirmDelete: "cd" });

			component.ngOnInit();

			const translation = component.getTranslation();

			expect(translation.title).toBe("ttt");
		});
	});

	describe("onClearLogs(): void", () => {

		it("alert called", async () => {

			component.ngOnInit();
			await component.onClearLogs();
			expect(alertStub.present).toHaveBeenCalled();
		});
	});

	describe("clearLogs(): void", () => {

		it("removes messages in memory", () => {

			component.clearLogs();
			expect(loggingServiceStub.removeLogMessages).toHaveBeenCalled();
		});

		it("removes messages from local storage", () => {

			(component as any).localStorageKeys = signal("abc");

			component.clearLogs();

			expect(loggingServiceStub.removeLogMessagesFromLocalStorage).toHaveBeenCalledWith("abc");
		});
	});
});
