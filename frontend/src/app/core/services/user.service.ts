import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private api =
    'http://localhost:8080/api';
  
    constructor(private http: HttpClient) {}

  private userSubject =
    new BehaviorSubject<User | null>(null);

  user$ =
    this.userSubject.asObservable();

  setUser(user: User) {
    this.userSubject.next(user);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  clearUser() {
    this.userSubject.next(null);
  }

  
  fetchCurrentUser(): Observable<User> {
  return this.http.get<User>(`${this.api}/user/me`);  
}
}
