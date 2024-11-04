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
    return this.http.get(`${this.apiUrl}/post/${(id > 0) ? id : ''}`, { headers });
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
  
  
}
