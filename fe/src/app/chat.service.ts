import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import Pusher from 'pusher-js';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Pusher.logToConsole = true;

  private pusher: Pusher;
  private channel: any;
  private conversation_id: string = '0';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.pusher = new Pusher('4e5599d0fbce181db90e', { cluster: 'ap1' });
    // Pusher.logToConsole = true;

    this.setPusher();
  }

  setPusher() {
    /* Here */
    if (this.channel) {
      this.channel.unbind_all();
      this.pusher.unsubscribe(this.channel.name);
    }

    this.channel = this.pusher.subscribe(`chat-${String(this.conversation_id)}`);
    // console.log(this.channel);
  }

  setConversationId(id: string) {

    this.conversation_id = id;
    this.setPusher();
  }

  public bindEvent(eventName: string, callback: (data: any) => void): void {
    if (this.channel) {
      this.channel.bind(eventName, callback);
      console.log(`Bound event '${eventName}' to channel '${this.channel.name}'`);
    } else {
      console.error('No channel to bind the event to.');
    }
  }

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
    return this.http.post(`${this.apiUrl}/chat`, mess, { headers });
  }

  recallMessage(id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.patch(`${this.apiUrl}/chat/${id}`, {}, { headers });
  }
}
