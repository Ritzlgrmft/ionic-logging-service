import { Component } from "@angular/core";

import { LoggingService, Logger } from "ionic-logging-service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"]
})
export class AppComponent {
	public title = "ionic-logging-service";

	private logger: Logger;

	constructor(
		private loggingService: LoggingService
	) {

	}

	public writeLog(): void {
		console.info("writeLog");
	}
}
