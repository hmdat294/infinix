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
import { CurrencyVNDPipe } from '../currency-vnd.pipe';
import { PaymentService } from '../service/payment.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, MiniChatComponent, CurrencyVNDPipe],
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
    private paymentService: PaymentService
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
          console.log('Message event received:', data);

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
        this.eventService.bindEvent('App\\Events\\NotificationEvent', (data: any) => {
          console.log('Notification event received:', data);

          this.notification.unshift(data.data);
        });

      });
  }

  updateNotification(notification_id: number) {
    this.notificationService.updateNotification(notification_id).subscribe(
      (res: any) => {
        console.log(res);
        this.notification.find((item: any) => item.id == notification_id).is_read = 1;
      });
  }

  deleteNotification(notification_id: number) {
    this.notificationService.deleteNotification(notification_id).subscribe(
      (res: any) => {
        console.log(res);
        this.notification = this.notification.filter((item: any) => item.id != notification_id);
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

  diaLogHeader: string = '';

  viewDiaLogHeader(action: string) {
    this.diaLogHeader = (this.diaLogHeader == action) ? '' : action;
  }

  paymentVnpay() {
    const data = {
      'price': 15000,
    }
    this.paymentService.paymentVnpay(data).subscribe(
      (response) => {
        if (response.url)
          window.location.href = response.url;
      }
    );
  }
  
  paymentZalopay() {
    const data = {
      'price': 19000,
    }
    this.paymentService.paymentZalopay(data).subscribe(
      (response) => {
        if (response.url)
          window.location.href = response.url;
      }
    );
  }

}
