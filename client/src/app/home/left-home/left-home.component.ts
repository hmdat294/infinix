import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { EventService } from '../../service/event.service';
import { Router, RouterModule } from '@angular/router';
import { ChatService } from '../../service/chat.service';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';
import { SettingService } from '../../service/setting.service';

@Component({
  selector: 'app-left-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyVNDPipe],
  templateUrl: './left-home.component.html',
  styleUrl: './left-home.component.css'
})
export class LeftHomeComponent implements OnInit {

  userRequest: any = [];
  groupRequest: any = [];
  user: any = [];

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private chatService: ChatService,
    private settingService: SettingService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.authService.getUser(0).subscribe(
      (response) => {
        this.user = response.data;
      });

    this.authService.getRequestFriend().subscribe(
      (response) => {
        this.userRequest = response.data;

        this.eventService.bindEvent('App\\Events\\FriendRequestEvent', (data: any) => {
          console.log('Friend request event:', data);

          if (data.status == "pending" && data.receiver.id == this.user.id && data.sender.id != this.user.id) this.userRequest.push(data);

          if (data.status == "accepted" || data.status == "canceled" || data.status == "rejected") {
            this.userRequest = this.userRequest.filter((request: any) => request.id !== data.id);
          }
        });

        this.eventService.bindEvent('App\\Events\\CancelFriendRequestEvent', (data: any) => {
          console.log('Cancel friend request event:', data);

        });
      });

    this.chatService.getGroup().subscribe(
      (response) => {
        this.groupRequest = response.data;

        this.eventService.bindEvent('App\\Events\\ConversationInvitationEvent', (data: any) => {
          console.log('Group request event:', data);

          if (data.status == "pending") this.groupRequest.push(data);

          if (data.status == "accepted") {
            this.groupRequest = this.groupRequest.filter((request: any) => request.id !== data.id);
          }
        });
      }
    )

  }

  acceptRequest(id: number, status: string) {
    this.authService.acceptFriend({ id, status }).subscribe(
      (response) => {
        console.log(response);
      });
  }

  acceptGroupRequest(id: number, status: string) {
    this.authService.acceptGroup({ id, status }).subscribe(
      (response) => {
        console.log(response);
        if (status == 'accepted') this.router.navigate(['/chat']);
      });
  }

  shortenTextByWords(text: string, maxWords: number): string {
    return this.settingService.shortenTextByWords(text, maxWords);
  }

}
