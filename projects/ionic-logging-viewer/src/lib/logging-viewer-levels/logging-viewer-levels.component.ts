import { Component, OnDestroy, OnInit, effect, inject } from "@angular/core";

import { Logger, LoggingService } from "ionic-logging-service";

import { LoggingViewerFilterService } from "../logging-viewer-filter.service";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";


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
	imports: [IonicModule, FormsModule]
})
export class LoggingViewerLevelsComponent implements OnInit, OnDestroy {

	private loggingService = inject(LoggingService);
	private loggingViewerFilterService = inject(LoggingViewerFilterService);

	/**
	 * Log levels used for filtering: DEBUG, INFO, WARN, ERROR
	 */
	public logLevels: string[];

	/**
	 * Selected level.
	 */
	public selectedLevel: string;

	private logger: Logger;

	/**
	 * Creates a new instance of the component.
	 */
	constructor() {
		this.logger = this.loggingService.getLogger("Ionic.Logging.Viewer.Levels.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.logLevels = [];
		this.logLevels.push(
			"DEBUG",
			"INFO",
			"WARN",
			"ERROR",
		);

		// handle signals of loggingViewerFilterService, to refresh,
		// when someone else modifies the level
		effect(() => {
			this.selectedLevel = this.loggingViewerFilterService.level;
		});

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

		this.logger.exit(methodName);
	}

	/**
	 * Clean up.
	 */
	public ngOnDestroy(): void {
		const methodName = "ngOnDestroy";
		this.logger.entry(methodName);

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
