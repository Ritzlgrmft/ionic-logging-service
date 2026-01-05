import { Component, OnDestroy, OnInit, inject, input, effect } from "@angular/core";
import { Subscription } from "rxjs";

import { Logger, LoggingService, LogLevelConverter, LogMessage } from "ionic-logging-service";

import { LoggingViewerFilterService } from "../logging-viewer-filter.service";
import { IonicModule } from "@ionic/angular";
import { DatePipe } from "@angular/common";

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
	styleUrls: ["./logging-viewer.component.scss"],
	imports: [IonicModule, DatePipe]
})
export class LoggingViewerComponent implements OnInit, OnDestroy {

	private loggingService = inject(LoggingService);
	private loggingViewerFilterService = inject(LoggingViewerFilterService);

	/**
	 * Comma-separated list of localStorageKeys. If set, the logs get loaded from localStorage instead of memory.
	 */
	public readonly localStorageKeys = input<string>(undefined);

	/**
	 * Log messages which fulfill the filter condition.
	 */
	public logMessagesForDisplay: LogMessage[];

	private logger: Logger;
	private logMessages: LogMessage[];
	private logMessagesChangedSubscription: Subscription;

	/**
	 * Creates a new instance of the component.
	 */
	constructor() {
		this.logger = this.loggingService.getLogger("Ionic.Logging.Viewer.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		// handle signals, to refresh the messages, when filter is modified
		effect(() => {
			this.filterLogMessages(this.loggingViewerFilterService.level, this.loggingViewerFilterService.search);
		});

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
		this.filterLogMessages(this.loggingViewerFilterService.level, this.loggingViewerFilterService.search);

		// subscribe to loggingService.logMessagesChanged event, to refresh, when new message is logged
		this.logMessagesChangedSubscription = this.loggingService.logMessagesChanged.subscribe(async () => {
			this.loadLogMessages();
			this.filterLogMessages(this.loggingViewerFilterService.level, this.loggingViewerFilterService.search);
		});

		this.logger.exit(methodName);
	}

	/**
	 * Clean up.
	 */
	public ngOnDestroy(): void {
		const methodName = "ngOnDestroy";
		this.logger.entry(methodName);

		if (this.logMessagesChangedSubscription) {
			this.logMessagesChangedSubscription.unsubscribe();
		}

		this.logger.exit(methodName);
	}

	/**
	 * Filter the log messages.
	 */
	public filterLogMessages(level: string, search: string): void {
		this.logMessagesForDisplay = this.logMessages.filter(
			(message) => this.filterLogMessagesByLevel(message, level) && this.filterLogMessagesBySearch(message, search));
	}

	/**
	 * Check if the log message's level fulfills the level condition.
	 *
	 * @param message the log message to check
	 * @returns true if check was successful
	 */
	public filterLogMessagesByLevel(message: LogMessage, level: string): boolean {
		return LogLevelConverter.levelFromString(message.level) >= LogLevelConverter.levelFromString(level);
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
	public filterLogMessagesBySearch(message: LogMessage, search: string): boolean {
		const searchRegex = new RegExp(search, "i");
		return message.logger.search(searchRegex) >= 0 ||
			message.methodName.search(searchRegex) >= 0 ||
			message.message.join("|").search(searchRegex) >= 0;
	}

	/**
	 * Load the current log messages.
	 * For unit test purposes mainly.
	 */
	public loadLogMessages(): void {
		if (this.localStorageKeys()) {
			this.logMessages = [];
			for (const localStorageKey of this.localStorageKeys().split(",")) {
				this.logMessages = this.logMessages.concat(this.loggingService.getLogMessagesFromLocalStorage(localStorageKey));
			}
			this.logMessages = this.logMessages.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
		} else {
			this.logMessages = this.loggingService.getLogMessages();
		}
	}
}
