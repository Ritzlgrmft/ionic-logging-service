import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LoggingViewerComponent } from "./logging-viewer/logging-viewer.component";
import { LoggingViewerFilterService } from "./logging-viewer-filter.service";
import { LoggingViewerLevelsComponent } from "./logging-viewer-levels/logging-viewer-levels.component";
import { LoggingViewerSearchComponent } from "./logging-viewer-search/logging-viewer-search.component";
import { LoggingViewerModalComponent } from "./logging-viewer-modal/logging-viewer-modal.component";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule
	],
	declarations: [
		LoggingViewerComponent,
		LoggingViewerSearchComponent,
		LoggingViewerLevelsComponent,
		LoggingViewerModalComponent
	],
	entryComponents: [
	],
	exports: [
		LoggingViewerComponent,
		LoggingViewerSearchComponent,
		LoggingViewerLevelsComponent,
		LoggingViewerModalComponent
	],
	providers: [
		LoggingViewerFilterService
	]
})
export class LoggingViewerModule { }
