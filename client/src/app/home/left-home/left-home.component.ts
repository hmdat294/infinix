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
  user: any = [];

  constructor(private authService: AuthService, private eventService: EventService) {

  }

  ngOnInit(): void {

    if (localStorage.getItem('auth_token')) {
      this.authService.getUser(0).subscribe(
        (response) => this.user = response);
    }

    this.authService.getRequestFriend().subscribe(
      (response) => {
        this.userRequest = response.data;
        // console.log(this.userRequest);

        this.eventService.bindEvent('App\\Events\\FriendRequestEvent', (data: any) => {
          console.log('Friend request event:', data);

          if (data.status == "pending" && data.receiver.id == this.user.id) this.userRequest.push(data);
          
          if (data.status == "accepted") {
            this.userRequest = this.userRequest.filter((request: any) => request.id !== data.id);
          }
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
