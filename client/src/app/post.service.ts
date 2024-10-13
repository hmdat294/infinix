import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPost(id: number = 0): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/post/${(id > 0) ? id : ''}`, { headers });
  }

  getPostByUser(id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/user/${id}/posts`, { headers });
  }

  postPost(value: any): Observable<any> {
    console.log(value);
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/post`, value, { headers });
  }
}
