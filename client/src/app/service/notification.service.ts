import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private sharedNotiChat = new BehaviorSubject<any>('Default Value');
  sharedNotiChat$ = this.sharedNotiChat.asObservable();

  updateNotiChat(newValue: any) {
    this.sharedNotiChat.next(newValue);
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private apiUrl = 'http://localhost:8000/api';

  getNotification(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/notification`, { headers });
  }

  updateNotificationAll(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/notification/update_all`, {}, { headers });
  }

  deleteNotificationAll(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.delete(`${this.apiUrl}/notification/destroy_all`, { headers });
  }

  updateNotification(notification_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/notification/${notification_id}`, {}, { headers });
  }

  deleteNotification(notification_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.delete(`${this.apiUrl}/notification/${notification_id}`, { headers });
  }

  updateNotificationChat(conversation_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/notification/update_by_conversation/${conversation_id}`, {}, { headers });
  }

  deleteNotificationChat(conversation_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.delete(`${this.apiUrl}/notification/destroy_by_conversation/${conversation_id}`, { headers });
  }


}
