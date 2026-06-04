import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quote } from '../models/quote';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {


  private api =
    'http://localhost:8080/api/quote';

  constructor(
    private http: HttpClient
  ) {}

  getAll() {
    return this.http.get<Quote[]>(
      `${this.api}/getAllQuotes`,
    );
  }

  getAllMyQuotes() {
    return this.http.get<Quote[]>(
      `${this.api}/getAllMyQuotes`,
    );
  }


  generateAIQuote(
    quote: any
  ) {

    return this.http.post(
      `${this.api}/generateAIQuote`,
      quote
    );
  }

  create(
    quote: any
  ) {

    return this.http.post(
      `${this.api}/createQuote`,
      quote
    );
  }
}
