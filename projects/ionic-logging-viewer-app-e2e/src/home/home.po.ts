import { browser, element, by } from "protractor";
import { setTimeout } from "timers";
import { Utils } from "../utils";

export class HomePage {
	navigateTo() {
		return browser.get("/home");
	}

	public async clickButton(label: string): Promise<void> {
		const button = element(by.cssContainingText("ion-button", label));
		await button.click();
	}

	public async setLogLevel(level: string): Promise<void> {
		const select = element.all(by.css("ion-select")).get(0);
		await select.click();
		await Utils.sleep(500);
		const popOver = element(by.css("ion-select-popover"));
		const levelItem = popOver.all(by.cssContainingText("ion-item", level));
		await levelItem.click();
		await Utils.sleep(500);
	}

	public async getViewerMessageCount(): Promise<number> {
		const loggingViewer = element(by.css("ionic-logging-viewer"));
		const messageItems = loggingViewer.all(by.css("ion-item"));
		return await messageItems.count();
	}
}
