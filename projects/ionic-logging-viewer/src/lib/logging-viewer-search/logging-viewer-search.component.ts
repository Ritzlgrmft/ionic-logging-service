import { Component, OnInit, OnDestroy, Input } from "@angular/core";

import { Subscription } from "rxjs";

import { LoggingService, Logger } from "ionic-logging-service";

import { LoggingViewerFilterService } from "../logging-viewer-filter.service";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";

/**
 * Component for displaying the search bar for filtering the current logs.
 *
 * The component can be embedded in any web page using:
 *
 * &lt;ionic-logging-viewer-search placeholder="Search">&lt;/ionic-logging-viewer-search>
 */
@Component({
    selector: "ionic-logging-viewer-search",
    templateUrl: "./logging-viewer-search.component.html",
    styleUrls: ["./logging-viewer-search.component.scss"],
    imports: [IonicModule, FormsModule]
})
export class LoggingViewerSearchComponent implements OnInit, OnDestroy {

	/**
	 * Placeholder to be shown in the empty search bar.
	 */
	@Input()
	public placeholder: string;

	/**
	 * Current search value.
	 */
	public search: string;

	private logger: Logger;
	private filterChangedSubscription: Subscription;

	/**
	 * Creates a new instance of the component.
	 */
	constructor(
		loggingService: LoggingService,
		private loggingViewerFilterService: LoggingViewerFilterService) {

		this.logger = loggingService.getLogger("Ionic.Logging.Viewer.Search.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

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

		if (!this.placeholder) {
			this.placeholder = "Search";
		}
		this.search = this.loggingViewerFilterService.search;

		// subscribe to loggingViewerFilterService.filterChanged event, to refresh,
		// when someone else modifies the search value
		this.filterChangedSubscription = this.loggingViewerFilterService.filterChanged.subscribe(() => {
			this.search = this.loggingViewerFilterService.search;
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
	 * Callback when the search value was changed in the UI.
	 */
	public onSearchChanged(): void {
		const methodName = "onSearchChanged";
		this.logger.entry(methodName, this.search);

		this.loggingViewerFilterService.search = this.search;

		this.logger.exit(methodName);
	}
}
