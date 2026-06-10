import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { provideZonelessChangeDetection } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { provideRouter } from "@angular/router";

describe("AppComponent", () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				AppComponent,
				IonicModule.forRoot(),
			],
			providers: [
				provideZonelessChangeDetection(),
				provideRouter([])
			]
		}).compileComponents();
	});

	it("should create the app", () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});

	it("should render router outlet", () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector("ion-router-outlet")).toBeTruthy();
	});
});
