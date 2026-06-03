import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-sidebar',
  imports: [ CommonModule,
    RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
   constructor(
    public userService: UserService
  ) {}

  get isAdmin(): boolean {

    return this.userService
      .getUser()?.role === 'ADMIN';
  }
}
