import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import Pusher from 'pusher-js';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private apiUrl = 'http://localhost:8000/api';

  getList(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/chat`, { headers });
  }

  getMessageUser(id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/chat/${id}`, { headers });
  }

  sendMessage(mess: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/message`, mess, { headers });
  }

  recallMessage(id: number, value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.patch(`${this.apiUrl}/message/${id}`, value, { headers });
  }
}
