import { Component } from "@angular/core";
import { ToastController, ModalController } from "@ionic/angular";

import { AjaxAppender, LocalStorageAppender, Logger, LoggingService, LogLevel } from "ionic-logging-service";
import { LoggingViewerModalComponent, LoggingViewerTranslation, LoggingViewerModalProperties } from "ionic-logging-viewer";
import { environment } from "../../environments/environment";

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
	public allowClearLogs: boolean;
	public localStorageKeys: string | undefined;

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
		this.logLevels = Object.keys(LogLevel).filter(key => this.mapLogLevel(key) !== undefined);
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
			confirmDelete: "myConfirmDelete",
			ok: "myOk",
			searchPlaceholder: "mySearch",
			title: "myTitle",
		};
		this.allowClearLogs = true;

		this.logger.exit(methodName);
	}

	public onLogLevelOrLoggerChanged(): void {
		const methodName = "onLogLevelOrLoggerChanged";
		this.logger.entry(methodName);

		const logger = this.loggingService.getLogger(this.testLoggerName);
		logger.setLogLevel(this.mapLogLevel(this.testLogLevel) as LogLevel);

		this.logger.exit(methodName);
	}

	public onAjaxAppenderConfigChanged(): void {
		const methodName = "onLogLevelOrLoggerChanged";
		this.logger.entry(methodName);

		const appenders = this.loggingService.getRootLogger().getInternalLogger().getEffectiveAppenders();
		let ajaxAppender = appenders.find((a) => a.toString() === "Ionic.Logging.AjaxAppender") as AjaxAppender | undefined;
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
		let localStorageAppender =
			appenders.find((a) => a.toString() === "Ionic.Logging.LocalStorageAppender") as LocalStorageAppender | undefined;
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
		const componentProps: LoggingViewerModalProperties =
			{ localStorageKeys: this.localStorageKeys, allowClearLogs: this.allowClearLogs };
		if (this.selectedLanguage === "custom") {
			componentProps.translation = this.translation;
		} else {
			componentProps.language = this.selectedLanguage;
		}
		const modal = await this.modalController.create({
			component: LoggingViewerModalComponent,
			componentProps
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

	private mapLogLevel(key: string): LogLevel | undefined {
		switch (key) {
			case "ALL":
				return LogLevel.ALL;
			case "TRACE":
				return LogLevel.TRACE;
			case "DEBUG":
				return LogLevel.DEBUG;
			case "INFO":
				return LogLevel.INFO;
			case "WARN":
				return LogLevel.WARN;
			case "ERROR":
				return LogLevel.ERROR;
			case "FATAL":
				return LogLevel.FATAL;
			case "OFF":
				return LogLevel.OFF;
			default:
				return undefined;
		}
	}
}
