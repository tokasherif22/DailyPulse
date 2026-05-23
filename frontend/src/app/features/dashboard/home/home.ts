import { Component, OnInit } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  template: `<p>Welcome to the Dashboard Home!</p>
  <!-- <p>{{ message }}</p> -->
  <button (click)="logout()">Logout</button>`,
  styleUrl: './home.scss',
})

export class Home {
  message = '';

  constructor(
    private authService: Auth,
    private router: Router
  ) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  // ngOnInit(): void {

  //   this.authService
  //     .getProtectedData()
  //     .subscribe({

  //       next: (response) => {

  //         this.message = response;
  //       },

  //       error: (error) => {

  //         console.error(error);
  //       }
  //     });
  // }
}
