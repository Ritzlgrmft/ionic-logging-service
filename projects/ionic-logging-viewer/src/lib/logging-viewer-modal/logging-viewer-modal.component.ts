import { Component, OnInit, Input } from "@angular/core";

import { ModalController, Platform, AlertController } from "@ionic/angular";

import { Logger, LoggingService } from "ionic-logging-service";

import { LoggingViewerTranslation } from "../logging-viewer-translation.model";

import { addIcons } from "ionicons";
import { closeCircle, trashOutline } from "ionicons/icons";

/**
 * Ionic modal containing [LoggingViewerComponent](LoggingViewerComponent.html),
 * [LoggingViewerLevelsComponent](LoggingViewerLevelsComponent.html) and
 * [LoggingViewerSearchComponent](LoggingViewerSearchComponent.html).
 */
@Component({
    selector: "ionic-logging-viewer-modal",
    templateUrl: "./logging-viewer-modal.component.html",
    styleUrls: ["./logging-viewer-modal.component.scss"],
    standalone: false
})
export class LoggingViewerModalComponent implements OnInit {

	private static languageEn = "en";
	private static languageDe = "de";

	/**
	 * Language to be used for the modal.
	 * Currently supported: en, de
	 */
	@Input()
	public language: string;

	/**
	 * Translation to be used for the modal.
	 * If specified, the language is ignored.
	 */
	@Input()
	public translation: LoggingViewerTranslation;

	/**
	 * Comma-separated list of localStorageKeys. If set, the logs get loaded from localStorage instead of memory.
	 */
	@Input()
	public localStorageKeys: string;

	/**
	 * Flag showing a delete button, which removes all existing log messages.
	 */
	@Input()
	public allowClearLogs: boolean;

	/**
	 * Flag controlling which close button will be shown.
	 */
	public isAndroid: boolean;

	private logger: Logger;

	private translations: Record<string, LoggingViewerTranslation>;

	/**
	 * Creates a new instance of the component.
	 */
	constructor(
		platform: Platform,
		private alertController: AlertController,
		private modalController: ModalController,
		private loggingService: LoggingService) {

		this.logger = loggingService.getLogger("Ionic.Logging.Viewer.Modal.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.isAndroid = platform.is("android");
		addIcons({ closeCircle, trashOutline });

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
			confirmDelete: "Delete all log messages?",
			ok: "Ok",
			searchPlaceholder: "Search",
			title: "Logging",
		};
		this.translations[LoggingViewerModalComponent.languageDe] = {
			cancel: "Abbrechen",
			confirmDelete: "Alle Logs löschen?",
			ok: "Ok",
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
	 * Eventhandler called when the clear button is clicked.
	 */
	public async onClearLogs(): Promise<void> {
		const methodName = "onClearLogs";
		this.logger.entry(methodName);

		const alert = await this.alertController.create({
			header: this.getTranslation().confirmDelete,
			buttons: [
				{
					text: this.getTranslation().cancel,
					role: "cancel",
					cssClass: "secondary"
				},
				{
					text: this.getTranslation().ok,
					handler: () => {
						this.clearLogs();
					}
				},
			]
		});
		await alert.present();

		this.logger.exit(methodName);
	}

	/**
	 * Clear logs.
	 */
	public clearLogs(): void {
		if (this.localStorageKeys) {
			for (const localStorageKey of this.localStorageKeys.split(",")) {
				this.loggingService.removeLogMessagesFromLocalStorage(localStorageKey);
			}
		} else {
			this.loggingService.removeLogMessages();
		}
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
