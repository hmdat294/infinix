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
 
  getConversationsGrowthData(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/conversations-growth`, { headers });
  }
  getReports(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/report`, { headers });
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
  getTotalUser(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/total-users`, { headers });
  }
  getTotalPost(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/total-posts`, { headers });
  }
  getTotalReport(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/total-reports`, { headers });
  }
  getUserGrowthData(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/users-growth`, { headers });
  }
  getPostGrowthData(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/statistics/posts-growth`, { headers });
  }
  getTotalUsers(): Observable<{ data: number }> {
    return this.http.get<{ data: number }>('api_endpoint_here');
  }
  updateReportStatus(id: number, status: string): Observable<any> {
    const headers = this.authService.getToken();  
    return this.http.post(`${this.apiUrl}/report/${id}`, { status }, { headers });
}

deleteReport(id: number): Observable<any> {
  const headers = this.authService.getToken();
  return this.http.delete(`${this.apiUrl}/report/${id}`, { headers });
}


  
  
  
}
