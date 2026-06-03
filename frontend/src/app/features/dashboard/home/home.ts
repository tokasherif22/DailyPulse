import { Component, OnInit } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  // template: `<p>Welcome to the Dashboard Home!</p>
  // <!-- <p>{{ message }}</p> -->
  // <!-- <button (click)="logout()">Logout</button> -->
  // `,
  styleUrl: './home.scss',
})

export class Home {
  message = '';
  
  constructor(
    public userService: UserService,
    private authService: Auth,
    private router: Router
  ) {
  }

  ngOnInit() {
  console.log(this.userService.getUser());
}

  // logout() {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  // }
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
