import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { EventService } from '../../event.service';

@Component({
  selector: 'app-left-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './left-home.component.html',
  styleUrl: './left-home.component.css'
})
export class LeftHomeComponent implements OnInit {

  userRequest: any = [];

  constructor(private authService: AuthService, private eventService: EventService) {

  }

  ngOnInit(): void {
    this.authService.getRequestFriend().subscribe(
      (response) => {
        this.userRequest = response.data;
        // console.log(this.userRequest);

        this.eventService.bindEvent('App\\Events\\FriendRequestEvent', (data: any) => {
          console.log('Friend request event:', data);
          if (data.status == "pending") this.userRequest.push(data);
        });

      });

  }

  acceptRequest(id: number, status: string) {
    this.authService.acceptFriend({ id, status }).subscribe(
      (response) => {
        console.log(response);
      });
  }


}
