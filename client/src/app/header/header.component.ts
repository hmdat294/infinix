import { AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { filter } from 'rxjs';
import { EventService } from '../service/event.service';
import { ChatService } from '../service/chat.service';
import { MiniChatComponent } from '../mini-chat/mini-chat.component';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, MiniChatComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  friends: any = [];
  keyword: string = '';
  currentRoute: string | undefined;
  conversation: any[] = [];
  notification: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private eventService: EventService,
    private chatService: ChatService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url.split('/')[1];

    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe(
      (event: any) =>
        this.currentRoute = event.urlAfterRedirects.split('/')[1]
    );

    this.chatService.conversation$.subscribe(conversation => {
      // console.log('Updated conversation from localStorage:', conversation);
      this.conversation = conversation;
    });

    this.authService.getUser(0).subscribe(
      (res: any) => {
        this.eventService.bindEvent('App\\Events\\UserSendMessageEvent', (data: any) => {
          console.log('Message received:', data);

          if (this.conversation.includes(data.data.conversation_id))
            this.conversation = this.conversation.filter(id => id !== data.data.conversation_id);

          if (this.conversation.length >= 5)
            this.conversation.shift();

          this.conversation.push(data.data.conversation_id);
          this.chatService.updateConversation(this.conversation);

        });
      });

    this.notificationService.getNotification().subscribe(
      (data) => {
        console.log(data);
        this.notification = data.data;
      });
  }

  clearSearch() {
    this.keyword = '';
    this.friends = [];
  }

  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => {
        console.log(response);
        this.clearSearch();
      });
  }

  gotoSearch(event: KeyboardEvent, keyword: string) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.router.navigate(['/search', keyword]);
    }
  }

  diaLogNoti: boolean = false;

  diaLogNotification() {
    this.diaLogNoti = !this.diaLogNoti;
  }


}
