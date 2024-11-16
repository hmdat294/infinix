import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private apiUrl = 'http://localhost:8000/api';

  getNotification(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/notification`, { headers });
  }

  updateNotification(notification_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/notification/${notification_id}`, {}, { headers });
  }

  deleteNotification(notification_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.delete(`${this.apiUrl}/notification/${notification_id}`, { headers });
  }
}
