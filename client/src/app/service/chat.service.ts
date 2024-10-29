import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Pusher from 'pusher-js';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private conversationSource = new BehaviorSubject<number[]>(this.getConversationFromStorage());
  conversation$ = this.conversationSource.asObservable();

  constructor(private zone: NgZone, private http: HttpClient, private authService: AuthService) {
    // Lắng nghe sự kiện storage để phát hiện thay đổi trong localStorage từ các tab khác
    window.addEventListener('storage', (event) => {
      if (event.key === 'conversation') {
        this.zone.run(() => {
          const updatedConversation = this.getConversationFromStorage();
          this.conversationSource.next(updatedConversation);
        });
      }
    });
  }

  updateConversation(conversation: number[]) {
    // Cập nhật conversation và lưu vào localStorage
    this.conversationSource.next(conversation);
    localStorage.setItem('conversation', JSON.stringify(conversation));
  }

  private getConversationFromStorage(): number[] {
    const conversation = localStorage.getItem('conversation');
    return conversation ? JSON.parse(conversation) : [];
  }



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

  updateGroup(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/update-chat-group`, value, { headers });
  }

  getImageByConversation(conversation_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/conversation/${conversation_id}/medias/`, { headers });
  }
}
