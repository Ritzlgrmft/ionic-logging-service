import { Component } from "@angular/core";
import { ToastController, ModalController } from "@ionic/angular";

import { AjaxAppender, LocalStorageAppender, Logger, LoggingService, LogLevel } from "ionic-logging-service";
import { LoggingViewerModalComponent, LoggingViewerTranslation } from "ionic-logging-viewer";
import { environment } from "../../environments/environment.prod";

@Component({
	selector: "app-home",
	templateUrl: "home.page.html",
	styleUrls: ["home.page.scss"],
})
export class HomePage {

	public testLoggerName: string;
	public testMethod: string;
	public testLogLevel: string;
	public logLevels: string[];
	public batchSizes: number[];
	public message: string;

	public ajaxAppenderEnabled: boolean;
	public ajaxAppenderUrl: string;
	public ajaxAppenderThreshold: string;
	public ajaxAppenderBatchSize: number;

	public localStorageAppenderConfiguration = {
		enabled: false,
		localStorageKey: "",
		threshold: "",
		maxMessages: 0,
		maxMessagesValues: [10, 50, 250]
	};

	public languages: string[];
	public selectedLanguage: string;
	public translation: LoggingViewerTranslation;
	public localStorageKeys: string;

	private logger: Logger;

	constructor(
		private modalController: ModalController,
		private toastController: ToastController,
		private loggingService: LoggingService
	) {

		this.logger = loggingService.getLogger("Ionic.Logging.Sample.HomePage");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.testLoggerName = "TestLogger";
		this.testMethod = "TestMethod";
		this.testLogLevel = "INFO";
		this.logLevels = Object.keys(LogLevel).filter(key => typeof LogLevel[key] === "number");
		this.batchSizes = [1, 5, 10];
		this.message = "message";
		this.onLogLevelOrLoggerChanged();

		const appenders = loggingService.getRootLogger().getInternalLogger().getEffectiveAppenders();
		const ajaxAppender = appenders.find((a) => a.toString() === "Ionic.Logging.AjaxAppender") as AjaxAppender;
		this.ajaxAppenderEnabled = (ajaxAppender !== undefined);
		this.ajaxAppenderUrl = window.location.origin;
		this.ajaxAppenderThreshold = "WARN";
		this.ajaxAppenderBatchSize = 1;

		const localStorageAppender = appenders.find((a) => a.toString() === "Ionic.Logging.LocalStorageAppender") as LocalStorageAppender;
		this.localStorageAppenderConfiguration.enabled = (localStorageAppender !== undefined);
		if (localStorageAppender) {
			this.localStorageAppenderConfiguration.localStorageKey = localStorageAppender.getLocalStorageKey();
			this.localStorageAppenderConfiguration.threshold = localStorageAppender.getThreshold().toString();
			this.localStorageAppenderConfiguration.maxMessages = localStorageAppender.getMaxMessages();
		} else {
			this.localStorageAppenderConfiguration.localStorageKey = environment.logging.localStorageAppender.localStorageKey;
			this.localStorageAppenderConfiguration.threshold = environment.logging.localStorageAppender.threshold;
			this.localStorageAppenderConfiguration.maxMessages = environment.logging.localStorageAppender.maxMessages;
		}

		this.languages = ["en", "de", "custom"];
		this.selectedLanguage = "en";
		this.translation = {
			cancel: "myCancel",
			searchPlaceholder: "mySearch",
			title: "myTitle",
		};

		this.logger.exit(methodName);
	}

	public onLogLevelOrLoggerChanged(): void {
		const methodName = "onLogLevelOrLoggerChanged";
		this.logger.entry(methodName);

		const logger = this.loggingService.getLogger(this.testLoggerName);
		logger.setLogLevel(LogLevel[this.testLogLevel]);

		this.logger.exit(methodName);
	}

	public onAjaxAppenderConfigChanged(): void {
		const methodName = "onLogLevelOrLoggerChanged";
		this.logger.entry(methodName);

		const appenders = this.loggingService.getRootLogger().getInternalLogger().getEffectiveAppenders();
		let ajaxAppender = appenders.find((a) => a.toString() === "Ionic.Logging.AjaxAppender") as AjaxAppender;
		if (ajaxAppender !== undefined) {
			this.loggingService.getRootLogger().getInternalLogger().removeAppender(ajaxAppender);
			ajaxAppender = undefined;
		}

		if (this.ajaxAppenderEnabled) {
			// add appender
			ajaxAppender = new AjaxAppender({
				batchSize: this.ajaxAppenderBatchSize,
				threshold: this.ajaxAppenderThreshold,
				url: this.ajaxAppenderUrl,
			});
			this.loggingService.getRootLogger().getInternalLogger().addAppender(ajaxAppender);

			// hack since loggingService.ajaxAppenderFailed gets setup only during loggingService.configure, which we do not call here
			ajaxAppender.appenderFailed.subscribe((message) => {
				this.onAjaxAppenderFailed(message);
			});
		}

		this.logger.exit(methodName);
	}

	public onLocalStorageConfigChanged(): void {
		const methodName = "onLocalStorageConfigChanged";
		this.logger.entry(methodName);

		const appenders = this.loggingService.getRootLogger().getInternalLogger().getEffectiveAppenders();
		let localStorageAppender = appenders.find((a) => a.toString() === "Ionic.Logging.LocalStorageAppender") as LocalStorageAppender;
		if (localStorageAppender !== undefined) {
			this.loggingService.getRootLogger().getInternalLogger().removeAppender(localStorageAppender);
			localStorageAppender = undefined;
		}

		if (this.localStorageAppenderConfiguration.enabled) {
			// add appender
			localStorageAppender = new LocalStorageAppender(this.localStorageAppenderConfiguration);
			this.loggingService.getRootLogger().getInternalLogger().addAppender(localStorageAppender);
		}

		this.logger.exit(methodName);
	}

	public logTrace(): void {
		const logger = this.loggingService.getLogger(this.testLoggerName);
		logger.trace(this.testMethod, this.message);
	}

	public logDebug(): void {

		const logger = this.loggingService.getLogger(this.testLoggerName);
		logger.debug(this.testMethod, this.message);
	}

	public logInfo(): void {

		const logger = this.loggingService.getLogger(this.testLoggerName);
		logger.info(this.testMethod, this.message);
	}

	public logWarn(): void {

		const logger = this.loggingService.getLogger(this.testLoggerName);
		logger.warn(this.testMethod, this.message);
	}

	public logError(): void {

		const logger = this.loggingService.getLogger(this.testLoggerName);
		logger.error(this.testMethod, this.message);
	}

	public logFatal(): void {

		const logger = this.loggingService.getLogger(this.testLoggerName);
		logger.fatal(this.testMethod, this.message);
	}

	public logEntry(): void {

		const logger = this.loggingService.getLogger(this.testLoggerName);
		logger.entry(this.testMethod, this.message);
	}

	public logExit(): void {

		const logger = this.loggingService.getLogger(this.testLoggerName);
		logger.exit(this.testMethod, this.message);
	}

	public async openModal(): Promise<void> {
		let componentProps: any;
		if (this.selectedLanguage === "custom") {
			componentProps = { translation: this.translation, localStorageKeys: this.localStorageKeys };
		} else {
			componentProps = { language: this.selectedLanguage, localStorageKeys: this.localStorageKeys };
		}
		const modal = await this.modalController.create({
			component: LoggingViewerModalComponent,
			componentProps: componentProps
		});
		await modal.present();
	}

	public changeLanguage(language: string): void {
		this.selectedLanguage = language;
	}

	private async onAjaxAppenderFailed(message: string): Promise<void> {
		const toast = await this.toastController.create({ message, duration: 2000 });
		await toast.present();
	}
}
