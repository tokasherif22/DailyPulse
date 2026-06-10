
import { Component, NgZone, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports : [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  // imports: [ Register ],
  // template: `<app-register></app-register>`,
  styleUrls: ['./app.scss']
})
export class App implements OnInit{
  // protected readonly title = signal('frontend');
   constructor(
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      console.log('Token payload:', payload);

      if (isExpired) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        return;
      }

      // wrap in ngZone so Angular detects the change properly
      this.ngZone.run(() => {
        this.userService.fetchCurrentUser().subscribe({
      next: (user) => this.userService.setUser(user),
      // error: () => {
      //   localStorage.removeItem('token');
      //   this.router.navigate(['/login']);
      // }
      });
    } );

    //   // fetch full user details from backend
    //   this.userService.fetchCurrentUser().subscribe({
    //   next: (user) => this.userService.setUser(user),
    //   // error: () => {
    //   //   localStorage.removeItem('token');
    //   //   this.router.navigate(['/login']);
    //   // }
    // });

      
    } catch (e) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}
