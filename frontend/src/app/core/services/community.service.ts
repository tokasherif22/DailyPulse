import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from '../models/quote';


@Injectable({ providedIn: 'root' })
export class CommunityService {

  private api = 'http://localhost:8080/api/community';

  constructor(private http: HttpClient) {}

  getFeed(page = 0, size = 20): Observable<Quote[]> {
    return this.http.get<Quote[]>(
      `${this.api}/feed?page=${page}&size=${size}`
    );
  }

  getHallOfFame(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.api}/hall-of-fame`);
  }
}
