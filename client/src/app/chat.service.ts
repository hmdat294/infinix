import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import Pusher from 'pusher-js';
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
    this.setPusherChat();
  }

  setPusherChat() {
    if (this.channel) {
      this.channel.unbind_all();
      this.pusher.unsubscribe(this.channel.name);
    }

    this.channel = this.pusher.subscribe(`chat-${this.conversation_id}`);
  }

  setConversationId(id: string) {
    this.conversation_id = id;
    this.setPusherChat();
  }

  public bindEventChat(eventName: string, callback: (data: any) => void): void {
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
    console.log(mess);
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/message`, mess, { headers });
  }

  recallMessage(id: number, content: string): Observable<any> {
    console.log(id);
    console.log(content);

    const headers = this.authService.getToken();
    return this.http.patch(`${this.apiUrl}/message/${id}`, { content }, { headers });
  }
}
