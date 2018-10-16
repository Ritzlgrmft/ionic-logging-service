import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { LoggingService, Logger, LogMessage } from "ionic-logging-service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
	public title = "ionic-logging-service";

	private logger: Logger;
	private logMessages: LogMessage[];
	private logMessagesChangedSubscription: Subscription;

	constructor(
		private loggingService: LoggingService
	) {
		this.logger = loggingService.getLogger("Ionic.Logging.Service.App");
	}

	public ngOnInit(): void {
		this.logMessages = this.loggingService.getLogMessages();

		// subscribe to loggingService.logMessagesChanged event, to refresh, when new message is logged
		this.logMessagesChangedSubscription = this.loggingService.logMessagesChanged.subscribe(() => {
			this.logMessages = this.loggingService.getLogMessages();
		});
	}

	/**
	 * Clean up.
	 */
	public ngOnDestroy(): void {
		this.logMessagesChangedSubscription.unsubscribe();
	}
	public writeLog(): void {
		const methodName = "writeLog";
		this.logger.info(methodName, "some text");
	}
}
