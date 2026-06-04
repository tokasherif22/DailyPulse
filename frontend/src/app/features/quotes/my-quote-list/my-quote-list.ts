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

  constructor(
    private quotesService: QuotesService
  ) {}

  ngOnInit(): void {

    this.quotesService
      .getAllMyQuotes()
      .subscribe(data => {

        this.quotes = data;
      });
  }
}
