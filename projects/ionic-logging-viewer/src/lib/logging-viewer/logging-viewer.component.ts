import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { Subscription } from "rxjs";

import { Logger, LoggingService, LogLevelConverter, LogMessage } from "ionic-logging-service";

import { LoggingViewerFilterService } from "../logging-viewer-filter.service";

/**
 * Component for displaying the current logs.
 *
 * The component can be embedded in any web page using:
 *
 * &lt;ionic-logging-viewer>&lt;/ionic-logging-viewer>
 */
@Component({
	selector: "ionic-logging-viewer",
	templateUrl: "./logging-viewer.component.html",
	styleUrls: ["./logging-viewer.component.scss"]
})
export class LoggingViewerComponent implements OnInit, OnDestroy {

	/**
	 * Comma-separated list of localStorageKeys. If set, the logs get loaded from localStorage instead of memory.
	 */
	@Input()
	public localStorageKeys: string | undefined;

	/**
	 * Log messages which fulfill the filter condition.
	 */
	public logMessagesForDisplay: LogMessage[] = [];

	private logger: Logger;
	private logMessages: LogMessage[] = [];
	private logMessagesChangedSubscription: Subscription | undefined;
	private filterChangedSubscription: Subscription | undefined;

	/**
	 * Creates a new instance of the component.
	 */
	constructor(
		private loggingService: LoggingService,
		private loggingViewerFilterService: LoggingViewerFilterService) {

		this.logger = loggingService.getLogger("Ionic.Logging.Viewer.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.logger.exit(methodName);
	}

	/**
	 * Initialize the component.
	 *
	 * This is done by reading the filter data from [LoggingViewerFilterService](LoggingViewerFilterService.html)
	 * and the log messages from [LoggingService](../../../ionic-logging-service/typedoc/index.html).
	 * If the localStorageKeys property is set, the messages are read from local storage.
	 */
	public ngOnInit(): void {
		const methodName = "ngOnInit";
		this.logger.entry(methodName);

		this.loadLogMessages();
		this.filterLogMessages();

		// subscribe to loggingService.logMessagesChanged event, to refresh, when new message is logged
		this.logMessagesChangedSubscription = this.loggingService.logMessagesChanged.subscribe(async () => {
			this.loadLogMessages();
			this.filterLogMessages();
		});

		// subscribe to loggingViewerFilterService.filterChanged event, to refresh, when filter is modified
		this.filterChangedSubscription = this.loggingViewerFilterService.filterChanged.subscribe(() => {
			this.filterLogMessages();
		});

		this.logger.exit(methodName);
	}

	/**
	 * Clean up.
	 */
	public ngOnDestroy(): void {
		const methodName = "ngOnDestroy";
		this.logger.entry(methodName);

		this.logMessagesChangedSubscription?.unsubscribe();
		this.filterChangedSubscription?.unsubscribe();

		this.logger.exit(methodName);
	}

	/**
	 * Filter the log messages.
	 */
	public filterLogMessages(): void {
		this.logMessagesForDisplay = this.logMessages.filter(
			(message) => this.filterLogMessagesByLevel(message) && this.filterLogMessagesBySearch(message));
	}

	/**
	 * Check if the log message's level fulfills the level condition.
	 *
	 * @param message the log message to check
	 * @returns true if check was successful
	 */
	public filterLogMessagesByLevel(message: LogMessage): boolean {
		const levelValue = this.loggingViewerFilterService.level;
		return LogLevelConverter.levelFromString(message.level) >= LogLevelConverter.levelFromString(levelValue);
	}

	/**
	 * Check if the log message fulfills the search condition.
	 *
	 * The search value gets searched in:
	 * - logger name
	 * - method name
	 * - message
	 *
	 * @param message the log message to check
	 * @returns true if check was successful
	 */
	public filterLogMessagesBySearch(message: LogMessage): boolean {
		const searchValue = new RegExp(this.loggingViewerFilterService.search, "i");
		return message.logger.search(searchValue) >= 0 ||
			message.methodName.search(searchValue) >= 0 ||
			message.message.join("|").search(searchValue) >= 0;
	}

	/**
	 * Load the current log messages.
	 * For unit test purposes mainly.
	 */
	public loadLogMessages(): void {
		if (this.localStorageKeys) {
			this.logMessages = [];
			for (const localStorageKey of this.localStorageKeys.split(",")) {
				this.logMessages = this.logMessages.concat(this.loggingService.getLogMessagesFromLocalStorage(localStorageKey));
			}
			this.logMessages = this.logMessages.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
		} else {
			this.logMessages = this.loggingService.getLogMessages();
		}
	}
}
