import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

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

  login(value: any): Observable<any> {
    console.log(value);
    return this.http.post(`${this.apiUrl}/login`, value);
  }
  
  register(value: any): Observable<any> {
    console.log(value);
    return this.http.post(`${this.apiUrl}/register`, value);
  }

  verifyEmail(id: string, hash: string): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/email/verify/${id}/${hash}`, { headers });
  }

  logout(): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  getFriend(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/friend`, { headers });
  }

  getRequestFriend(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/requestfriend`, { headers });
  }

  addFriend(receiver_id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/add-friend`, { 'receiver_id': receiver_id }, { headers });
  }

  acceptFriend(id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.patch(`${this.apiUrl}/accept-friend/${id}`, {}, { headers });
  }

  refuseFriend(id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.patch(`${this.apiUrl}/refuse-friend/${id}`, {}, { headers });
  }
}
