import { Component, inject, input, effect, computed } from "@angular/core";

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
export class LoggingViewerComponent {

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
	private logMessages = computed(() => {
		if (this.localStorageKeys()) {
			let messages: LogMessage[] = [];
			for (const localStorageKey of this.localStorageKeys().split(",")) {
				messages = messages.concat(this.loggingService.getLogMessagesFromLocalStorage(localStorageKey));
			}
			return messages.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
		} else {
			return this.loggingService.getLogMessages()();
		}
	});

	/**
	 * Creates a new instance of the component.
	 */
	constructor() {
		this.logger = this.loggingService.getLogger("Ionic.Logging.Viewer.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		// refresh the messages, when messages or filter are modified
		effect(() => {
			const logMessages = this.logMessages();
			const level = this.loggingViewerFilterService.level();
			const search = this.loggingViewerFilterService.search();
			this.filterLogMessages(logMessages, level, search);
		});

		this.logger.exit(methodName);
	}

	/**
	 * Filter the log messages.
	 */
	public filterLogMessages(logMessages: LogMessage[], level: string, search: string): void {
		this.logMessagesForDisplay = logMessages.filter(
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
}
