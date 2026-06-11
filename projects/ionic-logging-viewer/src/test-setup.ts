import "@angular/compiler";
import { afterEach } from "vitest";
import { TestBed, getTestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";

getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
    { teardown: { destroyAfterEach: false } },
);

afterEach(() => {
    TestBed.resetTestingModule();
});
