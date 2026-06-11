import { describe, it, expect, beforeEach, vi } from "vitest";

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

    const logger = {
        entry: vi.fn(),
        exit: vi.fn(),
    };
    const loggingService = {
        getLogger: vi.fn().mockReturnValue(logger),
        getLogMessages: vi.fn().mockReturnValue(logMessages),
        getLogMessagesFromLocalStorage: vi.fn().mockReturnValue(logMessagesFromLocalStorage),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                IonicModule,
                LoggingViewerComponent,
            ],
            providers: [
                { provide: LoggingService, useValue: loggingService }
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

            expect(loggingService.getLogger).toHaveBeenCalledWith("Ionic.Logging.Viewer.Component");
        });

        describe("effect", () => {

            describe("refreshes log messages for display when log messages change", () => {

                it("no localStorageKeys set", () => {
                    const logMessage = {
                        level: "DEBUG",
                        logger: "myLogger",
                        message: ["myMessage"],
                        methodName: "myMethod",
                        timeStamp: new Date(),
                    };
                    logMessages.set([logMessage]);
                    TestBed.tick();

                    expect(loggingService.getLogMessages).toHaveBeenCalled();
                });

                it("localStorageKeys set", () => {
                    fixture.componentRef.setInput("localStorageKeys", "key1,key2");

                    const logMessage = {
                        level: "DEBUG",
                        logger: "myLogger",
                        message: ["myMessage"],
                        methodName: "myMethod",
                        timeStamp: new Date(),
                    };
                    logMessages.set([logMessage]);
                    TestBed.tick();

                    expect(loggingService.getLogMessagesFromLocalStorage).toHaveBeenCalled();
                });
            });
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

            expect(component.logMessagesForDisplay().length).toBe(2);
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

        it("no logger returns false", () => {

            const logMessage = {
                level: "DEBUG",
                logger: undefined,
                message: ["myMessage"],
                methodName: "myMethod",
                timeStamp: new Date(),
            };

            const result = component.filterLogMessagesBySearch(logMessage, "xxx");

            expect(result).toBeFalsy();
        });
    });

    describe("localStorageKeys", () => {

        describe("local storage empty no log messages", () => {

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

    });
});
