import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';

  public auth_token_source = new BehaviorSubject<string>(this.getAuthTokenFromStorage());
  token$ = this.auth_token_source.asObservable();
  auth_token: string = '';

  constructor(private zone: NgZone, private http: HttpClient) {

    window.addEventListener('storage', (event) => {
      if (event.key === 'auth_token') {
        this.zone.run(() => {
          const updatedToken = this.getAuthTokenFromStorage();
          this.auth_token_source.next(updatedToken);
        });
      }
    });

    this.token$.subscribe(auth_token => this.auth_token = auth_token);
  }

  updateAuthToken(token: string) {
    this.auth_token_source.next(token);
    localStorage.setItem('auth_token', token);
  }

  removeAuthToken() {
    localStorage.removeItem('auth_token');
    this.auth_token_source.next('');
  }

  private getAuthTokenFromStorage(): string {
    const token = localStorage.getItem('auth_token');
    return token ? token : '';
  }

  getToken(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.auth_token}` });
  }

  getUser(id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/user/${(id >= 0) ? id : ''}`, { headers });
  }

  updateUser(data: any): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/update-user`, data, { headers });
  }

  updatePassword(value: any): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/change-password`, value, { headers });
  }

  forgotPassword(value: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/set-new-password`, value);
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

  logout(): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  getFriend(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/get-friends`, { headers });
  }

  getFriendOfFriend(user_id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/user/${user_id}/friends`, { headers });
  }

  getRequestFriend(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/friend-request`, { headers });
  }

  addFriend(receiver_id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/friend-request`, { 'receiver_id': receiver_id }, { headers });
  }

  cancelFriend(receiver_id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/cancel-friend-request/${receiver_id}`, {}, { headers });
  }

  acceptFriend(request: any): Observable<any> {
    const headers = this.getToken();
    return this.http.patch(`${this.apiUrl}/friend-request/${request.id}`, { 'status': request.status }, { headers });
  }

  unFriend(user_id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/unfriend/${user_id}`, {}, { headers });
  }

  acceptGroup(request: any): Observable<any> {
    const headers = this.getToken();
    return this.http.patch(`${this.apiUrl}/chat-group-invititaion/${request.id}`, { 'status': request.status }, { headers });
  }

  refuseFriend(id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.patch(`${this.apiUrl}/refuse-friend/${id}`, {}, { headers });
  }

  getCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-contact-info/`, { email });
  }

  getCodeForGot(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-verification-code/`, { email });
  }

  postCode(email: string, code: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-verification-code/`, { email, code });
  }

  getImageByUser(user_id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/user/${user_id}/medias/`, { headers });
  }

  getUserReport(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/user/reported-content`, { headers });
  }

  postUserBlock(user_id: number): Observable<any> {
    const headers = this.getToken();
    return this.http.post(`${this.apiUrl}/block-user/${user_id}`, {}, { headers });
  }

  getUserBlock(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/user/blocked-users`, { headers });
  }

  getFriendSuggestions(): Observable<any> {
    const headers = this.getToken();
    return this.http.get(`${this.apiUrl}/friend-suggestions`, { headers });
  }
}
