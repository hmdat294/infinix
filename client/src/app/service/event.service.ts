import { HostListener, Injectable, OnDestroy } from '@angular/core';
import Pusher from 'pusher-js';
import { AuthService } from './auth.service';
import { Observable, Subject } from 'rxjs';
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

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.pusher = new Pusher('74a1b74fdf0afc6b5833', { cluster: 'ap1' });

    if (this.channel) {
      this.channel.unbind_all();
      this.pusher.unsubscribe(this.channel.name);
    }

    this.authService.getUser(0).subscribe(
      (response) => this.channel = this.pusher.subscribe(`user.${response.data.id}`));

    this.setPusherComment();


    // this.router.events.subscribe((event) => {
      // if (event instanceof NavigationEnd) {
        this.isLoggedIn = (localStorage.getItem('auth_token')) ? true : false;
      // }
    // });

    if (this.isLoggedIn) {
      this.resetIdleTimer();
    }

    if (!this.hasEntered) {
      this.onUserEnter();
      this.hasEntered = true;  // Đánh dấu đã vào
    }
  }

  public bindEvent(eventName: string, callback: (data: any) => void): void {
    if (this.channel) {
      this.channel.bind(eventName, callback);
      console.log(`Bound event '${eventName}' to channel '${this.channel.name}'`);
    } else {
      console.error('No channel to bind the event to.');
    }
  }

  public bindEventPost(eventName: string, callback: (data: any) => void): void {
    if (this.channel_post) {
      this.channel_post.bind(eventName, callback);
      console.log(`Bound event '${eventName}' to channel_post '${this.channel_post.name}'`);
    } else {
      console.error('No channel_post to bind the event to.');
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


  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    const url = 'http://localhost:8000/api/update-online-status';
    const data = JSON.stringify({ online_status: 'offline' });
    
    // Gửi request qua sendBeacon
    navigator.sendBeacon(url, data);
  }
  

  private hasEntered: boolean = false;
  isLoggedIn: boolean = false;

  private apiUrl = 'http://localhost:8000/api';

  updateOnlineStatus(status: string): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/update-online-status`, { 'online_status': status }, { headers });
  }


  private idleTimeout: any;
  private idleTimeLimit = 10 * 1000; // 10 giây
  private isIdle = false; // Trạng thái hiện tại của người dùng
  private idleState = new Subject<boolean>();

  idleState$ = this.idleState.asObservable();

  ngOnDestroy() {
    clearTimeout(this.idleTimeout);
  }

  resetIdleTimer() {
    clearTimeout(this.idleTimeout);

    if (this.isIdle) {
      this.isIdle = false; // Chuyển trạng thái sang hoạt động
      this.idleState.next(false); // Phát trạng thái hoạt động
      console.log('Người dùng đã hoạt động trở lại!');

      this.updateOnlineStatus('online').subscribe(
        (response) => console.log(response)
      )
    }

    this.idleTimeout = setTimeout(() => this.onIdleTimeout(), this.idleTimeLimit);
  }

  private onUserEnter() {
    console.log("Người dùng đã truy cập vào trang lần đầu.");
    // Thực hiện các hành động khác nếu cần
    this.updateOnlineStatus('online').subscribe(
      (response) => console.log(response)
    )
  }

  private onIdleTimeout() {
    this.isIdle = true; // Chuyển trạng thái sang treo máy
    this.idleState.next(true); // Phát trạng thái treo máy
    console.log('Người dùng đã treo máy!');

    this.updateOnlineStatus('idle').subscribe(
      (response) => console.log(response)
    )
  }
}
