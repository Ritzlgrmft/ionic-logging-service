import { Component, OnInit } from "@angular/core";

// import { ViewController } from "@ionic/core";
import { NavParams, ModalController, Platform } from "@ionic/angular";

import { Logger, LoggingService } from "ionic-logging-service";

import { LoggingViewerTranslation } from "../logging-viewer-translation.model";

/**
 * Ionic modal containing [LoggingViewerComponent](LoggingViewerComponent.html),
 * [LoggingViewerLevelsComponent](LoggingViewerLevelsComponent.html) and
 * [LoggingViewerSearchComponent](LoggingViewerSearchComponent.html).
 */
@Component({
	selector: "ionic-logging-viewer-modal",
	templateUrl: "./logging-viewer-modal.component.html",
	styleUrls: ["./logging-viewer-modal.component.scss"]
})
export class LoggingViewerModalComponent implements OnInit {

	private static languageEn = "en";
	private static languageDe = "de";

	/**
	 * Language to be used for the modal.
	 * Currently supported: en, de
	 */
	public language: string;

	/**
	 * Translation to be used for the modal.
	 * If specified, the language is ignored.
	 */
	public translation: LoggingViewerTranslation;

	/**
	 * Flag controlling which close button will be shown.
	 */
	public isAndroid: boolean;

	// tslint:disable-next-line:completed-docs
	private logger: Logger;

	// tslint:disable-next-line:completed-docs
	private translations: { [language: string]: LoggingViewerTranslation; };

	/**
	 * Creates a new instance of the component.
	 */
	constructor(
		platform: Platform,
		private modalController: ModalController,
		navParams: NavParams,
		loggingService: LoggingService) {

		this.logger = loggingService.getLogger("Ionic.Logging.Viewer.Modal.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.language = navParams.get("language");
		this.translation = navParams.get("translation");
		this.isAndroid = platform.is("android");

		this.logger.exit(methodName);
	}

	/**
	 * Initializes the LoggingViewerModalComponent.
	 * It configures the supported translations.
	 */
	public ngOnInit(): void {
		// prepare translations
		this.translations = {};
		this.translations[LoggingViewerModalComponent.languageEn] = {
			cancel: "Cancel",
			searchPlaceholder: "Search",
			title: "Logging",
		};
		this.translations[LoggingViewerModalComponent.languageDe] = {
			cancel: "Abbrechen",
			searchPlaceholder: "Suchen",
			title: "Logging",
		};
	}

	/**
	 * Eventhandler called by Ionic when the modal is opened.
	 */
	public ionViewDidEnter(): void {
		const methodName = "ionViewDidEnter";
		this.logger.entry(methodName);

		this.logger.exit(methodName);
	}

	/**
	 * Eventhandler called when the cancel button is clicked.
	 */
	public async onClose(): Promise<void> {
		const methodName = "onClose";
		this.logger.entry(methodName);

		await this.modalController.dismiss();

		this.logger.exit(methodName);
	}

	/**
	 * Helper method returning the current translation:
	 * - the property translation if defined
	 * - the translation according property language if valid
	 * - English translation, otherwise
	 */
	public getTranslation(): LoggingViewerTranslation {
		if (typeof this.translation !== "undefined") {
			return this.translation;
		} else if (typeof this.language !== "undefined" && typeof this.translations[this.language] === "object") {
			return this.translations[this.language];
		} else {
			return this.translations[LoggingViewerModalComponent.languageEn];
		}
	}
}
