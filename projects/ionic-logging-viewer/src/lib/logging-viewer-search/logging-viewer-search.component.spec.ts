import { describe, it, expect, beforeEach, vi } from "vitest";

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { LoggingService } from "ionic-logging-service";

import { LoggingViewerSearchComponent } from "./logging-viewer-search.component";
import { LoggingViewerFilterService } from "../logging-viewer-filter.service";

describe("LoggingViewerSearchComponent", () => {
    let component: LoggingViewerSearchComponent;
    let fixture: ComponentFixture<LoggingViewerSearchComponent>;
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
                LoggingViewerSearchComponent,
            ],
            providers: [
                { provide: LoggingService, useValue: loggingServiceStub },
                LoggingViewerFilterService
            ]
        })
            .compileComponents();
    });

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

    describe("search updates", () => {

        it("signal updates search value", async () => {

            loggingViewerFilterService.search.set("X");

            setTimeout(() => {
                expect(component.search).toBe(loggingViewerFilterService.search());
                ;
            }, 0);
        });
    });

    describe("onSearchChanged", () => {

        it("updates value in filter service", () => {

            fixture.detectChanges();

            component.search += "Y";
            component.onSearchChanged();

            expect(loggingViewerFilterService.search()).toBe(component.search);
        });
    });

    describe("init", () => {

        it("given value for placeholder", () => {

            fixture.componentRef.setInput("placeholder", "abc");
            fixture.detectChanges();

            expect(component.placeholder()).toBe("abc");
        });
    });
});
