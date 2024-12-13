import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../service/chat.service';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../../service/post.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-left-profile',
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './left-profile.component.html',
    styleUrl: './left-profile.component.css'
})
export class LeftProfileComponent implements OnInit {

  user: any;
  listPost: any;
  images: any;
  friendOfFriend: any;
  friendOfFriendLimit: any;
  showMoreFriend: boolean = false;

  constructor(
    private authService: AuthService,
    private postService: PostService,
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
          });

        this.postService.getPostByUser().subscribe(
          (data) => {
            this.listPost = data.data;
          });

        this.authService.getFriendOfFriend(this.user.id).subscribe(
          (response) => {
            // console.log(response);
            this.friendOfFriend = response.data;
            this.friendOfFriendLimit = response.data.slice(0, 9);
          });

      });
  }

  zoomMedia: any = null;

  setZoomMedia(media: any) {
    this.zoomMedia = media;
  }

  viewMoreFriend() {
    this.showMoreFriend = !this.showMoreFriend;
  }

  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => {
        // console.log(response);
        this.user.is_sent_friend_request = true;
      });
  }

  unFriend(user_id: number): void {
    this.authService.unFriend(user_id).subscribe(
      (response) => {
        // console.log(response);

        if (this.user.id == user_id) {
          this.user.is_friend = false;
          this.user.is_sent_friend_request = false;
        }
        else {
          const friendfriend = this.friendOfFriend.find((item: any) => item.id === user_id);
          friendfriend.is_friend = false;
          friendfriend.is_sent_friend_request = false;
        }

      });
  }

  cancelRequest(receiver_id: number) {
    this.authService.acceptFriend({ id: receiver_id, status: 'rejected' }).subscribe(
      (response) => {
        // console.log(response);
      });
  }

  goToFriend(user_id: number) {
    this.showMoreFriend = false;
    this.router.navigate(['/friend-profile', user_id]);
  }
}
