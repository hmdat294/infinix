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
    return new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}` });
  }

  getUser(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/user/self`, { headers });
  }

  getUserById(id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/user/${(id >= 0) ? id : ''}`, { headers });
  }

  getListUser(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  login(value: any): Observable<any> {
    // console.log(value);
    return this.http.post(`${this.apiUrl}/login`, value);
  }

  register(value: any): Observable<any> {
    // console.log(value);
    return this.http.post(`${this.apiUrl}/register`, value);
  }

  verifyEmail(id: string, hash: string): Observable<any> {
    const authToken = localStorage.getItem('auth_token_register') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(`${this.apiUrl}/email/verify/${id}/${hash}`, { headers });
  }

  logout(): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  getFriend(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/get-friends`, { headers });
  }

  getRequestFriend(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/friend-request`, { headers });
  }

  addFriend(receiver_id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/friend-request`, { 'receiver_id': receiver_id }, { headers });
  }

  acceptFriend(request:any): Observable<any> {
    // console.log(request);
    
    const headers = this.getToken();
    return this.http.patch(`${this.apiUrl}/friend-request/${request.id}`, { 'status': request.status }, { headers });
  }

  refuseFriend(id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.patch(`${this.apiUrl}/refuse-friend/${id}`, {}, { headers });
  }

  getCode(email: string): Observable<any> {
    // console.log(email);
    return this.http.post(`${this.apiUrl}/verify-contact-info/`, { email });
  }

  postCode(email: string, code: number): Observable<any> {
    // console.log(email, code);
    return this.http.post(`${this.apiUrl}/verify-verification-code/`, { email, code });
  }
}
