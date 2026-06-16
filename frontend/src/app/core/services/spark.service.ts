import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SparkResponse } from '../models/spark';

@Injectable({ providedIn: 'root' })
export class SparkService {

  private api = 'http://localhost:8080/api/sparks';

  constructor(private http: HttpClient) {}

  toggle(quoteId: number): Observable<SparkResponse> {
    return this.http.post<SparkResponse>(`${this.api}/${quoteId}/toggle`, {});
  }

  getInfo(quoteId: number): Observable<SparkResponse> {
    return this.http.get<SparkResponse>(`${this.api}/${quoteId}`);
  }
}
