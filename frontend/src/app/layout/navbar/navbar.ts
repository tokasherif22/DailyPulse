import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

 constructor(
    public userService: UserService,
    private authService: Auth,
    private router: Router
  ) {}
  
  ngOnInit() {
  console.log("user:" + this.userService.getUser()?.fullName);
}

  logout() {

    this.authService.logout();

    this.userService.clearUser();

    this.router.navigate(['/login']);
  }
}
