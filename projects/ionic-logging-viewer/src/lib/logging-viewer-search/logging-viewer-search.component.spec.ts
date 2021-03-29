import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { LoggingService } from "ionic-logging-service";

import { LoggingViewerSearchComponent } from "./logging-viewer-search.component";
import { LoggingViewerFilterService } from "../logging-viewer-filter.service";

describe("LoggingViewerSearchComponent", () => {
	let component: LoggingViewerSearchComponent;
	let fixture: ComponentFixture<LoggingViewerSearchComponent>;
	let loggingViewerFilterService: LoggingViewerFilterService;

	const loggerStub = jasmine.createSpyObj("logger", ["entry", "exit"]);

	const loggingServiceStub = jasmine.createSpyObj("loggingServiceStub",
		["getLogger"]);
	loggingServiceStub.getLogger.and.returnValue(loggerStub);

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				LoggingViewerSearchComponent
			],
			imports: [
				FormsModule,
				IonicModule,
			],
			providers: [
				{ provide: LoggingService, useValue: loggingServiceStub },
				LoggingViewerFilterService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoggingViewerSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		loggingViewerFilterService = TestBed.inject(LoggingViewerFilterService);
	});

	describe("constructor", () => {

		it("gets correct named logger", () => {

			fixture.detectChanges();

			expect(loggingServiceStub.getLogger).toHaveBeenCalledWith("Ionic.Logging.Viewer.Search.Component");
		});
	});

	describe("filterChangedSubscription", () => {

		it("event updates search value", () => {

			fixture.detectChanges();

			loggingViewerFilterService.search += "X";

			expect(component.search).toBe(loggingViewerFilterService.search);
		});
	});

	describe("onSearchChanged", () => {

		it("updates value in filter service", () => {

			fixture.detectChanges();

			component.search += "Y";
			component.onSearchChanged();

			expect(loggingViewerFilterService.search).toBe(component.search);
		});
	});

	describe("ngOnInit", () => {

		it("use default, if no value for placeholder", () => {

			fixture.detectChanges();

			expect(component.placeholder).toBe("Search");
		});

		it("given value for placeholder", () => {

			component.placeholder = "abc";

			fixture.detectChanges();

			expect(component.placeholder).toBe("abc");
		});
	});
});
