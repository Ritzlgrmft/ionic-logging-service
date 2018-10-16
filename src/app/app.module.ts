import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";

import { LoggingService, LoggingServiceModule } from "ionic-logging-service";

import { AppComponent } from "./app.component";
import { environment } from "../environments/environment.prod";

export function configureLogging(loggingService: LoggingService): () => void {
	return () => loggingService.configure(environment.logging);
}

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		LoggingServiceModule
	],
	providers: [
		{
			deps: [LoggingService],
			multi: true,
			provide: APP_INITIALIZER,
			useFactory: configureLogging,
		}
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
