import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUser(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  getPost(id: number = 0): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/post/${id > 0 ? id : ''}`, { headers });
  }

  getConversationsGrowth(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/conversations-growth`, { headers });
  }

  getTotalReports(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/total-reports`, { headers });
  }

  getTotalPosts(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/total-posts`, { headers });
  }

  getTotalPostBookmarks(): Observable<number> {
    const headers = this.authService.getToken();
    return this.http.get<number>(`${this.apiUrl}/statistics/total-post-bookmarks`, { headers });
  }

  getTotalPostComments(): Observable<number> {
    const headers = this.authService.getToken();
    return this.http.get<number>(`${this.apiUrl}/statistics/total-post-comments`, { headers });
  }

  getTotalPostLikes(): Observable<number> {
    const headers = this.authService.getToken();
    return this.http.get<number>(`${this.apiUrl}/statistics/total-post-likes`, { headers });
  }

  getTotalPostShares(): Observable<number> {
    const headers = this.authService.getToken();
    return this.http.get<number>(`${this.apiUrl}/statistics/total-post-shares`, { headers });
  }
}
