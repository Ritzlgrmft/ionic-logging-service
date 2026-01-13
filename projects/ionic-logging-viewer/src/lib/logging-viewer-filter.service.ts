import { Injectable, inject, signal } from "@angular/core";

import { Logger, LoggingService } from "ionic-logging-service";

/**
 * Service for storing filter settings for logging viewer.
 */
@Injectable({
	providedIn: 'root'
})
export class LoggingViewerFilterService {

	private loggingService = inject(LoggingService);

	private logger: Logger;

	/**
	 * Signal for the current log level.
	 */
	public level = signal("DEBUG");

	/**
	 * Signal for the current search value.
	 */
	public search = signal("");

	/**
	 * Creates a new instance of the service.
	 *
	 * @param loggingService needed for internal logging.
	 */
	constructor() {
		this.logger = this.loggingService.getLogger("Ionic.Logging.Viewer.Filter.Service");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.logger.exit(methodName);
	}
}
