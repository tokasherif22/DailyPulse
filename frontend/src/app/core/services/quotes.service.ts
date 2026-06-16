import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quote } from '../models/quote';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {


  private api =
    'http://localhost:8080/api/quote';

  constructor(
    private http: HttpClient
  ) {}

  // getAll() {
  //   return this.http.get<Quote[]>(
  //     `${this.api}/getAllQuotes`,
  //   );
  // }

  getAllMyQuotes() {
    return this.http.get<Quote[]>(
      `${this.api}/getAllMyQuotes`,
    );
  }


  

  create(
    payload: any
  ) {

    return this.http.post(
      `${this.api}/createQuote`,
      payload
    );
  }

  publish(
    id: number
  ): Observable<Quote> {
  return this.http.patch<Quote>(
    `${this.api}/${id}/publish`,
     {}
    );
}

// send topic and recieve generated quote from ai
generateAIQuote(topic: string ): Observable<{ generatedText: string  }> {
  return this.http.post<{ generatedText: string  }>(
    `${this.api}/generateAIQuote`,
    { topic }
  );
}

// send topic and oldQuoteText, recieve new generated quote from ai
regenerateAIQuote(topic: string , oldQuoteText: string ): Observable<{ generatedText: string  }> {
  return this.http.post<{ generatedText: string  }>(
    `${this.api}/regenerateAIQuote`,
    { topic, oldQuoteText }
  );
}

// generateAIQuote(
//     quote: any
//   ) {

//     return this.http.post(
//       `${this.api}/generateAIQuote`,
//       quote
//     );
//   }
}
