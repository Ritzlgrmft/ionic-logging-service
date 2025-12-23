import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test';
}
