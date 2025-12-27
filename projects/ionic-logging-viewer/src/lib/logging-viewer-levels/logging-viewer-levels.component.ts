import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Logger, LoggingService } from "ionic-logging-service";

import { LoggingViewerFilterService } from "../logging-viewer-filter.service";

/**
 * Component for displaying the log levels for filtering the current logs.
 *
 * The component can be embedded in any web page using:
 *
 * &lt;ionic-logging-viewer-levels>&lt;/ionic-logging-viewer-levels>
 */
@Component({
    selector: "ionic-logging-viewer-levels",
    templateUrl: "./logging-viewer-levels.component.html",
    styleUrls: ["./logging-viewer-levels.component.scss"],
    standalone: false
})
export class LoggingViewerLevelsComponent implements OnInit, OnDestroy {

	/**
	 * Log levels used for filtering: DEBUG, INFO, WARN, ERROR
	 */
	public logLevels: string[];

	/**
	 * Selected level.
	 */
	public selectedLevel: string;

	private logger: Logger;
	private filterChangedSubscription: Subscription;

	/**
	 * Creates a new instance of the component.
	 */
	constructor(
		loggingService: LoggingService,
		private loggingViewerFilterService: LoggingViewerFilterService) {

		this.logger = loggingService.getLogger("Ionic.Logging.Viewer.Levels.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.logLevels = [];
		this.logLevels.push(
			"DEBUG",
			"INFO",
			"WARN",
			"ERROR",
		);

		this.logger.exit(methodName);
	}

	/**
	 * Initialize the component.
	 *
	 * This is done by reading the filter data from [LoggingViewerFilterService](LoggingViewerFilterService.html).
	 */
	public ngOnInit(): void {
		const methodName = "ngOnInit";
		this.logger.entry(methodName);

		this.selectedLevel = this.loggingViewerFilterService.level;

		// subscribe to loggingViewerFilterService.filterChanged event, to refresh,
		// when someone else modifies the level
		this.filterChangedSubscription = this.loggingViewerFilterService.filterChanged.subscribe(() => {
			this.selectedLevel = this.loggingViewerFilterService.level;
		});

		this.logger.exit(methodName);
	}

	/**
	 * Clean up.
	 */
	public ngOnDestroy(): void {
		const methodName = "ngOnDestroy";
		this.logger.entry(methodName);

		this.filterChangedSubscription.unsubscribe();

		this.logger.exit(methodName);
	}

	/**
	 * Callback when the level was changed in the UI.
	 */
	public onLevelChanged(): void {
		const methodName = "onLevelChanged";
		this.logger.entry(methodName, this.selectedLevel);

		this.loggingViewerFilterService.level = this.selectedLevel;

		this.logger.exit(methodName);
	}
}
