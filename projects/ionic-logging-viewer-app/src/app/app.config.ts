import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter, RouteReuseStrategy } from "@angular/router";

import { routes } from "./app.routes";
import { IonicRouteStrategy, provideIonicAngular } from "@ionic/angular/standalone";
import { LoggingService } from "ionic-logging-service";
import { environment } from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      useSetInputAPI: true,
    }),
    provideRouter(routes),
    provideAppInitializer(() => {
      const loggingService = inject(LoggingService);
      loggingService.configure(environment.logging);
    }),
  ]
};
