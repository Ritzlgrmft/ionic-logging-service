import { EventEmitter, Injectable, inject } from "@angular/core";

import { Logger, LoggingService } from "ionic-logging-service";

/**
 * Service for storing filter settings for logging viewer.
 */
@Injectable({
	providedIn: 'root'
})
export class LoggingViewerFilterService {

	private loggingService = inject(LoggingService);

	/**
	 * Event triggered when the filter was changed.
	 */
	public filterChanged: EventEmitter<void>;

	private logger: Logger;
	private levelValue: string;
	private searchValue: string;

	/**
	 * Creates a new instance of the service.
	 *
	 * @param loggingService needed for internal logging.
	 */
	constructor() {
		this.logger = this.loggingService.getLogger("Ionic.Logging.Viewer.Filter.Service");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.levelValue = "DEBUG";
		this.searchValue = "";
		this.filterChanged = new EventEmitter<void>();

		this.logger.exit(methodName);
	}

	/**
	 * Gets the current log level.
	 *
	 * @return log level
	 */
	public get level(): string {
		return this.levelValue;
	}

	/**
	 * Sets the new log level and emits a filterChanged event.
	 *
	 * @param value new slog level
	 */
	public set level(value: string) {
		this.levelValue = value;
		this.filterChanged.emit();
	}

	/**
	 * Gets the current search value.
	 *
	 * @return search value
	 */
	public get search(): string {
		return this.searchValue;
	}

	/**
	 * Sets the new search value and emits a filterChanged event.
	 *
	 * @param value new search value
	 */
	public set search(value: string) {
		this.searchValue = value;
		this.filterChanged.emit();
	}
}
