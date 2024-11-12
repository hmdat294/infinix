import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Pusher from 'pusher-js';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private apiUrl = 'http://localhost:8000/api';

  getHomePost(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/get-home-posts`, { headers });
  }

  getPostByUser(id: number = 0): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/get-profile-posts/${(id > 0) ? id : ''}`, { headers });
  }

  postPost(value: any): Observable<any> {
    console.log(value);
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/post`, value, { headers });
  }

  updatePost(id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.patch(`${this.apiUrl}/post/${id}`, { headers });
  }

  deletePost(id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.delete(`${this.apiUrl}/post/${id}`, { headers });
  }

  getComment(post_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/post/${post_id}/comments`, { headers });
  }

  postComment(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/comment`, value, { headers });
  }

  likePost(post_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/like`, { 'post_id': post_id }, { headers });
  }

  getSearch(keyword: string): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/search/${keyword}`, { headers });
  }

  getSearchUser(keyword: string): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/search-user/${keyword}`, { headers });
  }

  getSearchPost(keyword: string): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/search-post/${keyword}`, { headers });
  }

  bookmarkPost(post_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/bookmark/${post_id}`, {}, { headers });
  }

  getBookmarkByUser(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/user/bookmarks`, { headers });
  }

  sharePostToMyPage(post_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/share/${post_id}`, {}, { headers });
  }

  postReport(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/report`, value, { headers });
  }

  cancelReport(report_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.delete(`${this.apiUrl}/report/${report_id}`, { headers });
  }

  postLikeComment(comment_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/like-comment/`, { 'comment_id': comment_id }, { headers });
  }

}
