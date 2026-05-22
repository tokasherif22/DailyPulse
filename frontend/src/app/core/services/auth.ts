import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
private api =
    'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient
  ) {}

  register(data: any) {

    return this.http.post(
      `${this.api}/register`,
      data
    );
  }

  login(data: any) {

    return this.http.post(
      `${this.api}/login`,
      data
    );
  }

  logout() {

    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {

    return !!localStorage.getItem('token');
  }

  getToken(): string | null {

    return localStorage.getItem('token');
  }

}
