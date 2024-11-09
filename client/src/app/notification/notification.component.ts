import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
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
      });

  }
}
