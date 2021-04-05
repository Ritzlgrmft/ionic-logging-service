import { browser } from "protractor";

import { AppPage } from "./app.po";
import { protractor } from "protractor/built/ptor";
import { Utils } from "./utils";

describe("ionic-logging-viewer-app", () => {
	let page: AppPage;

	beforeEach(async (done) => {
		page = new AppPage();
		await page.navigateTo();
		done();
	});

	it("should redirect to home page", async (done) => {
		let homePageUrl = browser.baseUrl;
		if (!homePageUrl.endsWith("/")) {
			homePageUrl += "/";
		}
		homePageUrl += "home";

		let currentUrl: string;
		do {
			await Utils.sleep(500);
			currentUrl = await browser.getCurrentUrl();
			// eslint-disable-next-line no-console
			console.info(currentUrl, homePageUrl);
		} while (currentUrl !== homePageUrl);

		expect(currentUrl).toBe(homePageUrl);
		done();
	});
});
