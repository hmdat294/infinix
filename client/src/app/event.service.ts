import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private pusher: Pusher;
  private channel: any;
  private post_id: number = 0;

  constructor(private authService: AuthService) {
    this.pusher = new Pusher('74a1b74fdf0afc6b5833', { cluster: 'ap1' });

    if (this.post_id > 0) {
      this.setPusherComment();
    }
    else {
      this.authService.getUser(0).subscribe(
        (response) => {
          if (this.channel) {
            this.channel.unbind_all();
            this.pusher.unsubscribe(this.channel.name);
          }
          this.channel = this.pusher.subscribe(`user.${response.data.id}`);
        });
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

  setPusherComment() {
    if (this.channel) {
      this.channel.unbind_all();
      this.pusher.unsubscribe(this.channel.name);
    }
    this.channel = this.pusher.subscribe(`post.${this.post_id}`);
  }

  setPostId(id: number) {
    this.post_id = id;
    this.setPusherComment();
  }
}
