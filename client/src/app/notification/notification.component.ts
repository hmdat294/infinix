import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../service/notification.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, TranslateModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {

  notification: any;
  notificationFilter: any = [];
  is_read_notification: string = 'all';

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

    this.notificationService.getNotification().subscribe(
      (data) => {
        this.notification = data.data.filter((item: any) => item.conversation_id == null);
        // console.log(this.notification);
        this.notificationFilter = [...this.notification];
      });

  }

  noti_icon: any = {
    'user_like_post': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_thumb_like_20_filled"></i>',
    'user_comment_post': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_20_filled"></i>',
    'user_share_post': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_share_20_filled"></i>',
    'user_follow': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_person_heart_20_filled"></i>',
    'user_send_friend_request': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_person_add_20_filled"></i>',
    'user_accept_friend_request': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_person_available_20_filled"></i>',
    'user_send_conversation_invitation': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_add_20_filled"></i>',
    'user_accept_conversation_invitation': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_20_filled"></i>',
    'user_create_post': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_content_view_20_filled"></i>',
    'user_send_message': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_20_filled"></i>',
    'user_recall_message': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_dismiss_20_filled"></i>',
    'user_pin_message': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_pin_20_filled"></i>',
    'user_reply_message': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_arrow_back_20_filled"></i>',
    'shop_active': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_cart_20_regular"></i>'
  }

  filterNotification(action: string) {
    this.is_read_notification = action;
    this.notification = (action == 'unread') ? this.notification.filter((noti: any) => noti.is_read == 1) : this.notificationFilter;
  }

  updateNotification(notification_id: number) {
    this.notificationService.updateNotification(notification_id).subscribe(
      (res: any) => {
        // console.log(res);
        this.notification.find((item: any) => item.id == notification_id).is_read = 1;
      });
  }

  deleteNotification(notification_id: number) {
    this.notificationService.deleteNotification(notification_id).subscribe(
      (res: any) => {
        // console.log(res);
        this.notification = this.notification.filter((item: any) => item.id != notification_id);
      });
  }
}
