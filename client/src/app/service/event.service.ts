import { HostListener, Injectable, NgZone, OnDestroy } from '@angular/core';
import Pusher from 'pusher-js';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EventService implements OnDestroy {

  private pusher: Pusher;
  private channel: any;
  private channel_post: any;
  private post_id: number = 0;
  private hasEntered: boolean = false;
  user: any;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {

    this.pusher = new Pusher('74a1b74fdf0afc6b5833', { cluster: 'ap1' });

    this.authService.token$.subscribe(auth_token => {
      this.isLoggedIn = !!auth_token;

      if (this.isLoggedIn) {

        if (this.channel) {
          this.channel.unbind_all();
          this.pusher.unsubscribe(this.channel.name);
        }

        this.authService.getUser(0).subscribe(
          (response) => {
            this.channel = this.pusher.subscribe(`user.${response.data.id}`);
            this.user = response.data;
       
            this.resetIdleTimer();
    
            if (!this.hasEntered) {
              this.onUserEnter();
              this.hasEntered = true;
            }
          });

        this.setPusherComment();

      }
    });

  }

  public bindEvent(eventName: string, callback: (data: any) => void): void {
    if (this.channel) {
      this.channel.bind(eventName, callback);
      // console.log(`Bound event '${eventName}' to channel '${this.channel.name}'`);
    } else {
      // console.error('No channel to bind the event to.');
    }
  }

  public bindEventPost(eventName: string, callback: (data: any) => void): void {
    if (this.channel_post) {
      this.channel_post.bind(eventName, callback);
      // console.log(`Bound event '${eventName}' to channel_post '${this.channel_post.name}'`);
    } else {
      // console.error('No channel_post to bind the event to.');
    }
  }

  setPusherComment() {
    if (this.channel_post) {
      this.channel_post.unbind_all();
      this.pusher.unsubscribe(this.channel_post.name);
    }
    if (this.post_id > 0) {
      this.channel_post = this.pusher.subscribe(`post.${this.post_id}`);
    }
  }

  setPostId(id: number) {
    this.post_id = id;
    this.setPusherComment();
  }



  private apiUrl = 'http://localhost:8000/api';

  updateOnlineStatus(status: string): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/update-online-status`, 
      JSON.stringify({ 'user_id': this.user?.id, 'online_status': status }), { headers });
  }


  private idleTimeout: any;
  private idleTimeLimit = 10 * 60 * 1000; // 60 phút
  private isIdle = false;
  private idleState = new Subject<boolean>();

  idleState$ = this.idleState.asObservable();

  ngOnDestroy() {
    clearTimeout(this.idleTimeout);
  }

  resetIdleTimer() {
    clearTimeout(this.idleTimeout);

    if (this.isIdle && this.isLoggedIn) {
      this.isIdle = false;
      this.idleState.next(false);
      this.updateOnlineStatus('online').subscribe(
        (response) => {
          // console.log('Người dùng đã hoạt động trở lại!');
          // console.log(response);
        }
      )
    }

    if (this.isLoggedIn) {
      this.idleTimeout = setTimeout(() => this.onIdleTimeout(), this.idleTimeLimit);
    }
  }

  private onUserEnter() {
    this.updateOnlineStatus('online').subscribe(
      (response) => {
        // console.log("Người dùng đã truy cập vào trang lần đầu.");
        // console.log(response);
      }
    )
  }

  private onIdleTimeout() {
    this.isIdle = true;
    this.idleState.next(true);
    if (this.isLoggedIn) {
      this.updateOnlineStatus('idle').subscribe(
        (response) => {
          // console.log('Người dùng đã treo máy!');
          // console.log(response);
        }
      )
    }
  }
}
