import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../service/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {

  notification: any;

  constructor(
    private notificationService: NotificationService,
  ) { }
  ngOnInit(): void {

    this.notificationService.getNotification().subscribe(
      (data) => {
        console.log(data);
        this.notification = data.data;
      });

  }

  
  updateNotification(notification_id: number){
    this.notificationService.updateNotification(notification_id).subscribe(
      (res: any) => {
        console.log(res);
        this.notification.find((item:any) => item.id == notification_id).is_read = 1;
      });
  }

  deleteNotification(notification_id: number){
    this.notificationService.deleteNotification(notification_id).subscribe(
      (res: any) => {
        console.log(res);
        this.notification = this.notification.filter((item:any) => item.id != notification_id);
      });
  }
}
