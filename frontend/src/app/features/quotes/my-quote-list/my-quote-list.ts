import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Quote } from '../../../core/models/quote';
import { QuotesService } from '../../../core/services/quotes.service';
import { CommonModule } from '@angular/common';
import { FacebookService } from '../../../core/services/facebook.service';
import { UserService } from '../../../core/services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-quote-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './my-quote-list.html',
  styleUrl: './my-quote-list.scss',
})
export class MyQuoteList implements OnInit {
  quotes: Quote[] = [];
  loading = false;
  errorMessage = '';
  publishingId: number | null = null;  // ← tracks which quote is being published
  facebookConnected = false; 
  userFullName? = ''

  showFacebookEditor = false;
  selectedQuoteForFb: Quote | null = null;
  fbPostText = '';
  fbCaption = '';
  fbLoading = false;
  captionLoading = false;
  fbError = '';
  fbSuccess = '';

  // $user = JSON.parse(localStorage.getItem('user') || '{}'); // ← get user info for Facebook connection status
  constructor(
    private quotesService: QuotesService,
    private userService: UserService,
    private facebookService: FacebookService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
     // subscribe to user changes — updates whenever user is set
    this.userService.user$.subscribe(user => {
      this.facebookConnected = user?.facebookConnected ?? false;  // ← reactive
      this.userFullName = user?.fullName;
      this.cdr.detectChanges();
    });

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
            this.cdr.detectChanges(); // ← ensure UI updates after async data load
          }
        }

      );
  }

  get publishedQuotes(): Quote[] {
    return this.quotes.filter(q => q.status === 'PUBLISHED');
  }

  get draftQuotes(): Quote[] {
    return this.quotes.filter(q => q.status === 'DRAFT');
  }

  publish(id:number): void { 
    this.publishingId = id;

    this.quotesService.publish(id).subscribe({
      next: () => {
        // update status locally — no need to re-fetch the whole list
        const quote = this.quotes.find(q => q.id === id);
        if (quote) quote.status = 'PUBLISHED';
        this.publishingId = null;
      },
      error: () => {
        this.errorMessage = 'Failed to publish quote. Please try again.';
        this.publishingId = null;
        this.cdr.detectChanges(); 
      }
    });
  }

  openFacebookEditor(quote: Quote): void {
  console.log('Opening Facebook editor for:', quote.text);  
  this.selectedQuoteForFb = quote;
  this.fbPostText = quote.text;   // pre-fill with quote text
  this.fbCaption = '';
  this.fbError = '';
  this.fbSuccess = '';
  this.showFacebookEditor = true;
  this.cdr.detectChanges();  
}

closeFacebookEditor(): void {
  this.showFacebookEditor = false;
  this.selectedQuoteForFb = null;
}

closeOnOverlay(event: MouseEvent): void {
  if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
    this.closeFacebookEditor();
  }
}

generateFbCaption(): void {
  if (!this.selectedQuoteForFb) return;
  this.captionLoading = true;
  this.fbError = '';

  this.facebookService.generateCaption(
    this.fbPostText,
    this.selectedQuoteForFb.topic
  ).subscribe({
    next: (res) => {
      this.fbCaption = res.caption;
      this.captionLoading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.fbError = 'Failed to generate caption.';
      this.captionLoading = false;
      this.cdr.detectChanges();
    }
  });
}


publishToFacebook(): void {
  if (!this.selectedQuoteForFb) return;
  this.fbLoading = true;
  this.fbError = '';

  this.facebookService.publishPost({
    quoteId: this.selectedQuoteForFb.id,
    postText: this.fbPostText,
    caption: this.fbCaption
  }).subscribe({
    next: () => {
      this.fbSuccess = 'Published to Facebook successfully!';
      this.fbLoading = false;
      this.cdr.detectChanges();
      // close after 2 seconds
      setTimeout(() => this.closeFacebookEditor(), 2000);
    },
    error: () => {
      this.fbError = 'Failed to publish. Please reconnect Facebook and try again.';
      this.fbLoading = false;
      this.cdr.detectChanges();
    }
  });
}

}
