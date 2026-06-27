import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FacebookService {

  private api = 'http://localhost:8080/api/facebook';

  constructor(private http: HttpClient) {}

  getConnectUrl(): Observable<{ authUrl: string }> {
    return this.http.get<{ authUrl: string }>(`${this.api}/connect`);
  }

  disconnect(): Observable<void> {
    return this.http.delete<void>(`${this.api}/disconnect`);
  }

  generateCaption(text: string, topic: string[]): Observable<{ caption: string }> {
    return this.http.post<{ caption: string }>(`${this.api}/caption`, { text, topic });
  }

  getStatus(): Observable<{ connected: boolean }> {
  return this.http.get<{ connected: boolean }>(
    `${this.api}/status`
  );
}

  publishPost(data: {
    quoteId: number;
    postText: string;
    caption: string;
  }): Observable<void> {
    return this.http.post<void>(`${this.api}/publish`, data);
  }
}
