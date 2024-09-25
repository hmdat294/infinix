import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getToken(): HttpHeaders {
    const authToken = localStorage.getItem('auth_token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
  }

  getUser(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  login(value:any): Observable<any> {
    console.log(value);
    return this.http.post(`${this.apiUrl}/login`, value);
  }

  register(value:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, value);
  }

  logout(): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }
}
