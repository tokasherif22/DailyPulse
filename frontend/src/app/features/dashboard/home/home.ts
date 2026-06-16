import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { QuotesService } from '../../../core/services/quotes.service';
import{ Quote } from '../../../core/models/quote';
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
  loading = true;
  quotes: Quote[] = [];
  errorMessage = '';
  
  constructor(
    public userService: UserService,
    private quotesService: QuotesService,
    private cdr: ChangeDetectorRef,
    // private authService: Auth,
    // private router: Router
  ) {
  }

  ngOnInit() {
  console.log(this.userService.getUser());
  this.loading = true;
    this.quotesService
      .getAllMyQuotes()
      .subscribe(
        {
          next: (data) => {
            this.quotes = data;
            this.loading = false; 
            this.cdr.detectChanges(); // ← ensure UI updates after async data load
          },
          error: () => {
            this.errorMessage = 'Failed to load quotes.';
            this.loading = false;
            this.cdr.detectChanges()}
        }
      )
    }

     // Getters split the list — no extra API calls, no duplication
      get publishedQuotes(): Quote[] {
        return this.quotes.filter(q => q.status === 'PUBLISHED');
      }
    
      get draftQuotes(): Quote[] {
        return this.quotes.filter(q => q.status === 'DRAFT');
      }

      get scheduledQuotes(): Quote[] {
        return this.quotes.filter(q => q.scheduledAt && q.status === 'SCHEDULED');
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
