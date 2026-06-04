import { Component, OnInit } from '@angular/core';
import { Quote } from '../../../core/models/quote';
import { QuotesService } from '../../../core/services/quotes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-list.html',
  styleUrl: './quote-list.scss',
})
export class QuoteList 
  implements OnInit {

  quotes: Quote[] = [];

  constructor(
    private quotesService: QuotesService
  ) {}

  ngOnInit(): void {
    console.log('AllQuotes loaded');
     this.loadQuotes();
  }

  loadQuotes() {

  console.log('Loading quotes...');

  this.quotesService
      .getAll()
      .subscribe({

        next: data => {

          console.log(data);

          this.quotes = data;
        },

        error: err => {

          console.error(err);
        }
      });
}
}

