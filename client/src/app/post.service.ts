import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Pusher from 'pusher-js';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private pusher: Pusher;
  private channel: any;
  private user: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.pusher = new Pusher('74a1b74fdf0afc6b5833', { cluster: 'ap1' });

    this.authService.getUser(0).subscribe(
      (response) => {
        this.user = response.data;

        if (this.channel) {
          this.channel.unbind_all();
          this.pusher.unsubscribe(this.channel.name);
        }
        
        this.channel = this.pusher.subscribe(`user.${this.user.id}`);
      });
  }

  public bindEventPost(eventName: string, callback: (data: any) => void): void {
    if (this.channel) {
      this.channel.bind(eventName, callback);
      console.log(`Bound event '${eventName}' to channel '${this.channel.name}'`);
    } else {
      console.error('No channel to bind the event to.');
    }
  }






  private apiUrl = 'http://localhost:8000/api';

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

  getComment(value: any): Observable<any> {
    console.log(value);
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/comment/`, { headers });
  }

  postComment(value: any): Observable<any> {
    console.log(value);
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/comment`, value, { headers });
  }
}
