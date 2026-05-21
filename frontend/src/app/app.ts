
import { Component, signal } from '@angular/core';
import { Register } from './features/auth/register/register';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ Register ],
  template: `<app-register></app-register>`,
  styleUrls: ['./app.scss']
})
export class App {
  // protected readonly title = signal('frontend');
}
