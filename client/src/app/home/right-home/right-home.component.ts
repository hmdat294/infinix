import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { EventService } from '../../service/event.service';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../service/chat.service';
import { SettingService } from '../../service/setting.service';
import { TranslateModule } from '@ngx-translate/core';
import { LeftHomeComponent } from "../left-home/left-home.component";

@Component({
    selector: 'app-right-home',
    imports: [RouterModule, CommonModule, FormsModule, TranslateModule, LeftHomeComponent],
    templateUrl: './right-home.component.html',
    styleUrl: './right-home.component.css'
})
export class RightHomeComponent implements OnInit, AfterViewInit {
  user: any = [];
  friends_limit: any = [];
  friends: any = [];
  showFriendMore: boolean = false;
  keyword: string = '';
  friendsSearch: any = [];
  listUser: any;
  listGroup: any;
  listUserLimit: any;
  listGroupLimit: any;
  conversation: any[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService,
    private chatService: ChatService,
    private eventService: EventService,
    private settingService: SettingService,
  ) { }

  ngOnInit(): void {

    this.authService.token$.subscribe(auth_token => {
      if (!!auth_token) {
        this.authService.getUser(0).subscribe(
          (response) => {
            this.user = response;

            this.authService.getFriend().subscribe(
              (response) => {
                this.friends = response.data;
                // console.log(this.friends);

                const statusOrder: any = { online: 1, idle: 2, offline: 3 };

                this.friends = this.friends.sort((a: any, b: any) => statusOrder[a.online_status] - statusOrder[b.online_status]);

                this.friends_limit = this.friends.slice(0, 3);

                this.eventService.bindEvent('App\\Events\\FriendRequestEvent', (data: any) => {
                  // console.log('Friend request event:', data);

                  // nếu status là accepted thì data có sender và receiver, bản thân là 1 trong 2 thì thêm vào danh sách bạn bè người còn lại
                  if (data.status == "accepted") {
                    if (data.sender.id == this.user.data.id) {
                      this.pushFriendList(data.receiver);
                    }
                    if (data.receiver.id == this.user.data.id) {
                      this.pushFriendList(data.sender);
                    }
                  }
                });

                this.eventService.bindEvent('App\\Events\\UserConnectionEvent', (data: any) => {
                  // console.log('User online event:', data);

                  const friends = this.friends.find((item: any) => item.id == data.user.id) || {};
                  friends.online_status = data.status;

                });


              });

            this.chatService.getListChat().subscribe(
              (response) => {

                const friends = response.data.map((item: any) => ({
                  ...item,
                  users: item.users.filter((user: any) => user.id !== this.user.data.id)
                }))
                // console.log(friends);

                this.listUser = friends.filter((item: any) => item.is_group == 0);
                this.listGroup = friends.filter((item: any) => item.is_group == 1);
                this.listUserLimit = [...this.listUser.slice(0, 3)];
                this.listGroupLimit = [...this.listGroup.slice(0, 3)];
                // console.log(this.listUser);
                // console.log(this.listGroup);
              });
          });
      }
    });

    this.chatService.conversation$.subscribe(conversation => {
      // console.log('Updated conversation from localStorage:', conversation);
      this.conversation = conversation;
    });
  }

  is_full_user: boolean = false;
  is_full_group: boolean = false;

  moreUser() {
    this.is_full_user = !this.is_full_user;
    if (this.is_full_user)
      this.listUserLimit = [...this.listUser];
    else
      this.listUserLimit = [...this.listUser.slice(0, 3)];
  }

  moreGroup() {
    this.is_full_group = !this.is_full_group;
    if (this.is_full_user)
      this.listGroupLimit = [...this.listGroup];
    else
      this.listGroupLimit = [...this.listGroup.slice(0, 3)];
  }

  createChat(conversation_id: number) {
    if (this.conversation.includes(conversation_id)) {
      this.conversation = this.conversation.filter(id => id !== conversation_id);
    }

    if (this.conversation.length >= 5) {
      this.conversation.shift();
    }

    this.conversation.push(conversation_id);

    this.chatService.updateConversation(this.conversation);
    this.chatService.tagOpenBoxChat = true;
  }

  searchFriend() {
    if (this.keyword && !/^\s*$/.test(this.keyword)) {
      this.friendsSearch = this.friends.filter((friend: any) => {
        const keyword = this.settingService.removeVietnameseTones(this.keyword.toLowerCase().trim());
        const displayName = this.settingService.removeVietnameseTones(friend.profile.display_name.toLowerCase() || "");
        const email = this.settingService.removeVietnameseTones(friend.email.toLowerCase() || "");

        return displayName.includes(keyword) || email.includes(keyword);
      }
      );
    }
    else {
      this.friendsSearch = [];
    }
  }

  setFriendSearch() {
    return (this.friendsSearch.length > 0) ? this.friendsSearch : this.friends;
  }

  pushFriendList(data: any) {
    this.friends.unshift(data);
    this.friends_limit.unshift(data);
    this.friends_limit = this.friends.slice(0, 5);
  }

  ngAfterViewInit() {
    const accordion = this.el.nativeElement.querySelector('.a-accordion-header') as HTMLElement;
    const panel = this.el.nativeElement.querySelector('.accordion-panel') as HTMLElement;

    accordion.addEventListener('click', () => {

      accordion.classList.toggle('active');
      panel.classList.toggle('open');

      panel.style.maxHeight = (panel.classList.contains('open')) ? `${panel.scrollHeight}px` : '0px';
    });
  }

  friendMore() {
    this.showFriendMore = !this.showFriendMore;
  }
}
