import { Component, OnInit } from '@angular/core';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-home',
  imports: [],
  template: `<p>Welcome to the Dashboard Home!</p>
  <p>{{ message }}</p>`,
  styleUrl: './home.scss',
})

export class Home implements OnInit {
  message = '';

  constructor(
    private authService: Auth
  ) { }

  ngOnInit(): void {

    this.authService
      .getProtectedData()
      .subscribe({

        next: (response) => {

          this.message = response;
        },

        error: (error) => {

          console.error(error);
        }
      });
  }
}
