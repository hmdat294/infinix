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

  getListChat(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/chat`, { headers });
  }

  getMessageUser(id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/chat/${id}`, { headers });
  }

  getMessageGroup(id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/chat-group/${id}`, { headers });
  }

  sendMessage(mess: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/message`, mess, { headers });
  }

  recallMessage(id: number, value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.patch(`${this.apiUrl}/message/${id}`, value, { headers });
  }

  createGroup(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/chat-group`, value, { headers });
  }
  
  getGroup(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/chat-group-invititaion`, { headers });
  }

  addGroup(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/chat-group-invititaion`, value, { headers });
  }
}
