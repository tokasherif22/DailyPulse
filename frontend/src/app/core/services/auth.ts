import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
private api =
    'http://localhost:8080/api/';

  constructor(
    private http: HttpClient
  ) {}

  register(data: any) {

    return this.http.post(
      `${this.api}auth/register`,
      data
    );
  }

  login(data: any) {

    return this.http.post(
      `${this.api}auth/login`,
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

  getProtectedData() {

  return this.http.get(
    `${this.api}test/hello`,
    {
      responseType: 'text'
    }
  );
}

getCurrentUser() {

  return this.http.get<User>(
    'http://localhost:8080/api/user/me'
  );
}

}
