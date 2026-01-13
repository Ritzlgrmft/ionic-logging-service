import { describe, it, expect, beforeEach, vi } from "vitest";

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { LoggingService } from "ionic-logging-service";

import { LoggingViewerFilterService } from "../logging-viewer-filter.service";
import { LoggingViewerLevelsComponent } from "./logging-viewer-levels.component";

describe("LoggingViewerLevelsComponent", () => {

    let component: LoggingViewerLevelsComponent;
    let fixture: ComponentFixture<LoggingViewerLevelsComponent>;
    let loggingViewerFilterService: LoggingViewerFilterService;

    const loggerStub = {
        entry: vi.fn().mockName("logger.entry"),
        exit: vi.fn().mockName("logger.exit")
    };

    const loggingServiceStub = {
        getLogger: vi.fn().mockName("loggingServiceStub.getLogger")
    };
    loggingServiceStub.getLogger.mockReturnValue(loggerStub);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                IonicModule,
                LoggingViewerLevelsComponent,
            ],
            providers: [
                { provide: LoggingService, useValue: loggingServiceStub },
                LoggingViewerFilterService,
            ],
        })
            .compileComponents();
    });

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

    describe("level updates", () => {

        it("signal updates selected level", () => {

            if (loggingViewerFilterService.level() === "INFO") {
                loggingViewerFilterService.level.set("DEBUG");
            }
            else {
                loggingViewerFilterService.level.set("INFO");
            }

            fixture.detectChanges();

            expect(component.selectedLevel).toBe(loggingViewerFilterService.level());
        });
    });

    describe("onLevelChanged", () => {

        it("updates value in filter service", () => {

            fixture.detectChanges();

            if (component.selectedLevel === "INFO") {
                component.selectedLevel = "DEBUG";
            }
            else {
                component.selectedLevel = "INFO";
            }
            component.onLevelChanged();

            expect(loggingViewerFilterService.level()).toBe(component.selectedLevel);
        });
    });
});
