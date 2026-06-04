// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-create-quote',
//   imports: [CommonModule],
//   templateUrl: './create-quote.html',
//   styleUrl: './create-quote.scss',
// })
// export class CreateQuote {

//   topics = [
//     'MOTIVATION',

//   'SUCCESS',

//   'PRODUCTIVITY',

//   'LEADERSHIP',

//   'FITNESS',

//   'MINDSET',
//    'DISCIPLINE',

//     'HAPPINESS',

//     'GRATITUDE',

//     'BUSINESS'  ];
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';

interface QuoteForm {
  topic: string;
  text: string;
  status?: 'DRAFT' | 'PUBLISHED';
}

@Component({
  selector: 'app-create-quote',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-quote.html',
  styleUrl: './create-quote.scss'
})
export class CreateQuote {


    topics :string[] =  [
    'MOTIVATION',

  'SUCCESS',

  'PRODUCTIVITY',

  'LEADERSHIP',

  'FITNESS',

  'MINDSET',
   'DISCIPLINE',

    'HAPPINESS',

    'GRATITUDE',

    'BUSINESS'  ];

     quote: QuoteForm = {
    topic: '',
    text: '',
    status: 'DRAFT'
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private quoteService: QuotesService,
    private router: Router
  ) {}

  publish(): void {
    if (!this.quote.topic || !this.quote.text ) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.quote.status = 'PUBLISHED';

    this.quoteService.create(this.quote).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to save quote. Please try again.';
        console.error(err);
      }
    });
  }

  saveDraft(): void {
    if (!this.quote.topic || !this.quote.text ) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.quote.status = 'DRAFT';
    
    this.quoteService.create(this.quote).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to save quote. Please try again.';
        console.error(err);
      }
    });
  }

  reset(): void {
    this.quote = { topic: '', text: '' };
    this.errorMessage = '';
  }
}


