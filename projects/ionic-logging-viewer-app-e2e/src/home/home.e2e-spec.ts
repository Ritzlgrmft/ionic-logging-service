import { HomePage } from "./home.po";

describe("home page", () => {
	let page: HomePage;

	beforeEach(async (done) => {
		page = new HomePage();
		await page.navigateTo();
		done();
	});

	it("initial ==> viewer is empty", async (done) => {
		const messageCount = await page.getViewerMessageCount();
		expect(messageCount).toBe(0);
		done();
	});

	describe("log level INFO", () => {

		it("click info ==> viewer shows message", async (done) => {
			const oldMessageCount = await page.getViewerMessageCount();
			await page.clickButton("INFO");
			const newMessageCount = await page.getViewerMessageCount();
			expect(newMessageCount).toBe(oldMessageCount + 1);
			done();
		});

		it("click debug ==> viewer does not show message", async (done) => {
			const oldMessageCount = await page.getViewerMessageCount();
			await page.clickButton("DEBUG");
			const newMessageCount = await page.getViewerMessageCount();
			expect(newMessageCount).toBe(oldMessageCount);
			done();
		});
	});

	describe("log level DEBUG", () => {

		beforeEach(async (done) => {
			await page.setLogLevel("DEBUG");
			done();
		});

		it("click DEBUG ==> viewer shows message", async (done) => {
			const oldMessageCount = await page.getViewerMessageCount();
			await page.clickButton("DEBUG");
			const newMessageCount = await page.getViewerMessageCount();
			expect(newMessageCount).toBe(oldMessageCount + 1);
			done();
		});

	});
});
