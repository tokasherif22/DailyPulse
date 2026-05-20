import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
}