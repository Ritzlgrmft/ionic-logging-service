import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter, RouteReuseStrategy } from "@angular/router";

import { routes } from "./app.routes";
import { IonicRouteStrategy, provideIonicAngular } from "@ionic/angular/standalone";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes)
  ]
};
