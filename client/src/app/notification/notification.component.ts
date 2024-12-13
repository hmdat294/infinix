import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../service/notification.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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
  ) { }
  ngOnInit(): void {

    this.notificationService.getNotification().subscribe(
      (data) => {
        // console.log(data);
        this.notification = data.data;
        this.notificationFilter = [...this.notification];
      });

  }

  filterNotification(action: string) {
    this.is_read_notification = action;
    this.notification = (action == 'unread') ? this.notification.filter((noti: any) => noti.is_read == 1) : this.notificationFilter;
  }
  
  updateNotification(notification_id: number){
    this.notificationService.updateNotification(notification_id).subscribe(
      (res: any) => {
        // console.log(res);
        this.notification.find((item:any) => item.id == notification_id).is_read = 1;
      });
  }

  deleteNotification(notification_id: number){
    this.notificationService.deleteNotification(notification_id).subscribe(
      (res: any) => {
        // console.log(res);
        this.notification = this.notification.filter((item:any) => item.id != notification_id);
      });
  }
}
