import { EventEmitter } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { IonicModule, NavParams, ModalController, AlertController } from "@ionic/angular";

import { LogMessage, LoggingService } from "ionic-logging-service";

import { LoggingViewerModalComponent } from "./logging-viewer-modal.component";
import { LoggingViewerComponent } from "../logging-viewer/logging-viewer.component";
import { LoggingViewerSearchComponent } from "../logging-viewer-search/logging-viewer-search.component";
import { LoggingViewerLevelsComponent } from "../logging-viewer-levels/logging-viewer-levels.component";
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

	const modalControllerStub = jasmine.createSpyObj("modalControllerStub", ["dismiss"]);

	const navParamsStub = jasmine.createSpyObj("navParams", ["get"]);
	navParamsStub.get.and.returnValue(undefined);

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				LoggingViewerModalComponent,
				LoggingViewerSearchComponent,
				LoggingViewerLevelsComponent,
				LoggingViewerComponent
			],
			imports: [
				FormsModule,
				IonicModule,
			],
			providers: [
				{ provide: LoggingService, useValue: loggingServiceStub },
				{ provide: AlertController, useValue: alertControllerStub },
				{ provide: ModalController, useValue: modalControllerStub },
				{ provide: NavParams, useValue: navParamsStub },
				LoggingViewerFilterService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoggingViewerModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
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

		it("calls modalController.dismiss()", () => {

			component.onClose();

			expect(modalControllerStub.dismiss).toHaveBeenCalled();
		});
	});

	describe("getTranslation(): LoggingViewerTranslation", () => {

		it("known language, no translation: title is translated", () => {

			component.ngOnInit();
			component.language = "de";
			component.translation = undefined;

			const translation = component.getTranslation();

			expect(translation.title).toBe("Logging");
		});

		it("unknown language, no translation: english translation is used", () => {

			component.ngOnInit();
			component.language = "fr";
			component.translation = undefined;

			const translation = component.getTranslation();

			expect(translation.title).toBe("Logging");
		});

		it("no language, no translation: english translation is used", () => {

			component.ngOnInit();
			component.language = undefined;
			component.translation = undefined;

			const translation = component.getTranslation();

			expect(translation.title).toBe("Logging");
		});

		it("no language, but translation: translation is used", () => {

			component.ngOnInit();
			component.language = undefined;
			component.translation = { title: "ttt", cancel: "bc", searchPlaceholder: "sp", ok: "oo", confirmDelete: "cd" };

			const translation = component.getTranslation();

			expect(translation.title).toBe("ttt");
		});

		it("language and translation: translation is used", () => {

			component.ngOnInit();
			component.language = "en";
			component.translation = { title: "ttt", cancel: "bc", searchPlaceholder: "sp", ok: "oo", confirmDelete: "cd" };

			const translation = component.getTranslation();

			expect(translation.title).toBe("ttt");
		});
	});

	describe("onClearLogs(): void", () => {

		it("alert called", async (done: () => void) => {

			await component.onClearLogs();
			expect(alertStub.present).toHaveBeenCalled();

			done();
		});
	});

	describe("clearLogs(): void", () => {

		it("removes messages in memory", () => {

			component.clearLogs();
			expect(loggingServiceStub.removeLogMessages).toHaveBeenCalled();
		});

		it("removes messages from local storage", () => {

			component.localStorageKeys = "abc";
			component.clearLogs();

			expect(loggingServiceStub.removeLogMessagesFromLocalStorage).toHaveBeenCalled();
		});
	});
});
