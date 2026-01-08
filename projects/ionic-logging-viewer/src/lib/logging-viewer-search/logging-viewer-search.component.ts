import { Component, inject, input, effect } from "@angular/core";

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
export class LoggingViewerSearchComponent {

	private loggingService = inject(LoggingService);
	private loggingViewerFilterService = inject(LoggingViewerFilterService);

	/**
	 * Placeholder to be shown in the empty search bar.
	 */
	public readonly placeholder = input<string>(undefined);

	/**
	 * Current search value.
	 */
	public search: string;

	private logger: Logger;

	/**
	 * Creates a new instance of the component.
	 */
	constructor() {
		this.logger = this.loggingService.getLogger("Ionic.Logging.Viewer.Search.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		// handle signals of loggingViewerFilterService, to refresh,
		// when someone else modifies the search value
		effect(() => {
			const search = this.loggingViewerFilterService.search();
			this.search = search;
		});

		this.logger.exit(methodName);
	}

	/**
	 * Callback when the search value was changed in the UI.
	 */
	public onSearchChanged(): void {
		const methodName = "onSearchChanged";
		this.logger.entry(methodName, this.search);

		this.loggingViewerFilterService.search.set(this.search);

		this.logger.exit(methodName);
	}
}
