import { Component, OnInit } from '@angular/core';
import { Quote } from '../../../core/models/quote';
import { QuotesService } from '../../../core/services/quotes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-quote-list',
  imports: [CommonModule],
  templateUrl: './my-quote-list.html',
  styleUrl: './my-quote-list.scss',
})
export class MyQuoteList implements OnInit {
  quotes: Quote[] = [];
  loading = false;
  errorMessage = '';
  publishingId: number | null = null;  // ← tracks which quote is being published

  constructor(
    private quotesService: QuotesService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.quotesService
      .getAllMyQuotes()
      .subscribe(
        {
          next: (data) => {
            this.quotes = data;
            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'Failed to load quotes.';
            this.loading = false;
          }
        }

      );
  }

  // Getters split the list — no extra API calls, no duplication
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
      }
    });
  }
}
