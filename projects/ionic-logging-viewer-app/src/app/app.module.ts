import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { LoggingServiceModule, LoggingService } from "ionic-logging-service";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
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
        IonicModule.forRoot(),
        AppRoutingModule,
        LoggingServiceModule
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
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
