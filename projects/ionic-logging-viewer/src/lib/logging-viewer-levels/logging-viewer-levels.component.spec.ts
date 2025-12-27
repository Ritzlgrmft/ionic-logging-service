import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { LoggingService } from "ionic-logging-service";

import { LoggingViewerFilterService } from "../logging-viewer-filter.service";
import { LoggingViewerLevelsComponent } from "./logging-viewer-levels.component";

describe("LoggingViewerLevelsComponent", () => {

	let component: LoggingViewerLevelsComponent;
	let fixture: ComponentFixture<LoggingViewerLevelsComponent>;
	let loggingViewerFilterService: LoggingViewerFilterService;

	const loggerStub = jasmine.createSpyObj("logger", ["entry", "exit"]);

	const loggingServiceStub = jasmine.createSpyObj("loggingServiceStub",
		["getLogger"]);
	loggingServiceStub.getLogger.and.returnValue(loggerStub);

	beforeEach(waitForAsync(async () => {
		await TestBed
			.configureTestingModule({
				declarations: [
					LoggingViewerLevelsComponent,
				],
				imports: [
					FormsModule,
					IonicModule,
				],
				providers: [
					{ provide: LoggingService, useValue: loggingServiceStub },
					LoggingViewerFilterService,
				],
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoggingViewerLevelsComponent);

		component = fixture.componentInstance;

		loggingViewerFilterService = TestBed.inject(LoggingViewerFilterService);
	});

	describe("constructor", () => {

		it("gets correct named logger", () => {

			fixture.detectChanges();

			expect(loggingServiceStub.getLogger).toHaveBeenCalledWith("Ionic.Logging.Viewer.Levels.Component");
		});
	});

	describe("filterChangedSubscription", () => {

		it("event updates selected level", () => {

			fixture.detectChanges();

			if (loggingViewerFilterService.level === "INFO") {
				loggingViewerFilterService.level = "DEBUG";
			} else {
				loggingViewerFilterService.level = "INFO";
			}

			expect(component.selectedLevel).toBe(loggingViewerFilterService.level);
		});
	});

	describe("onLevelChanged", () => {

		it("updates value in filter service", () => {

			fixture.detectChanges();

			if (component.selectedLevel === "INFO") {
				component.selectedLevel = "DEBUG";
			} else {
				component.selectedLevel = "INFO";
			}
			component.onLevelChanged();

			expect(loggingViewerFilterService.level).toBe(component.selectedLevel);
		});
	});
});
