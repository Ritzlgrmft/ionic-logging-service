import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { LoggingViewerModule, LoggingViewerModalComponent } from "ionic-logging-viewer";

import { HomePage } from "./home.page";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: "",
                component: HomePage
            }
        ]),
        LoggingViewerModule
    ],
    declarations: [
        HomePage,
    ]
})
export class HomePageModule { }
