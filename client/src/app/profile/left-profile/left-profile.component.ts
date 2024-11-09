import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../service/chat.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './left-profile.component.html',
  styleUrl: './left-profile.component.css'
})
export class LeftProfileComponent implements OnInit {

  user: any;
  images: any;
  friendOfFriend: any;
  friendOfFriendLimit: any;
  showMoreFriend: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,  
  ) { }

  ngOnInit(): void {

    this.authService.getUser(0).subscribe(
      (response) => {
        this.user = response.data;
        // console.log(this.user);

        this.authService.getImageByUser(this.user.id).subscribe(
          (response) => {
            this.images = response.data;
          }
        )

        this.authService.getFriendOfFriend(this.user.id).subscribe(
          (response) => {
            console.log(response);
            this.friendOfFriend = response.data;
            this.friendOfFriendLimit = response.data.slice(0, 9);
          });

      });
  }

  zoomImg: string = '';

  setZoomIng(img: string) {
    this.zoomImg = img;
  }

  viewMoreFriend() {
    this.showMoreFriend = !this.showMoreFriend;
  }

  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => {
        console.log(response);
        this.user.is_sent_friend_request = true;
      });
  }

  goToFriend(user_id: number) {
    this.showMoreFriend = false;
    this.router.navigate(['/friend-profile', user_id]);
  }
}
