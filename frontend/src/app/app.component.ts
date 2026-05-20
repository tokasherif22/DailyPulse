import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './features/auth/register/component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    RegisterComponent],
  template: `
    <h1>DailyPulse</h1>

    <app-register></app-register>

    <router-outlet></router-outlet>
  `
})
export class AppComponent {

}