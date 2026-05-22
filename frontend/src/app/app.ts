
import { Component, signal } from '@angular/core';
import { Register } from './features/auth/register/register';
import { routes } from './app.routes';
import { RouterOutlet } from '@angular/router';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports : [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  // imports: [ Register ],
  // template: `<app-register></app-register>`,
  styleUrls: ['./app.scss']
})
export class App {
  // protected readonly title = signal('frontend');
}
