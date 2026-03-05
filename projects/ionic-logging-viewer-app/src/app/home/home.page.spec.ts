import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HomePage } from "./home.page";
import { IonicModule } from "@ionic/angular";

describe("HomePage", () => {
	let component: HomePage;
	let fixture: ComponentFixture<HomePage>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HomePage,
				IonicModule.forRoot()
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HomePage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
