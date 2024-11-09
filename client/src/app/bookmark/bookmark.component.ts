import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ChatService } from '../service/chat.service';

@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bookmark.component.html',
  styleUrl: './bookmark.component.css'
})
export class BookmarkComponent implements OnInit {

  listPost: any[] = [];
  currentUser: any;
  listUser: any;
  listGroup: any;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private chatService: ChatService,
  ) { }

  ngOnInit(): void {
    this.authService.getUser(0).subscribe(
      (data) => {
        this.currentUser = data.data;
      });

    this.chatService.getListChat().subscribe(
      (response) => {
        this.listUser = response.data.filter((item: any) => item.is_group == 0);
        this.listGroup = response.data.filter((item: any) => item.is_group == 1);
      });

    this.postService.getBookmarkByUser().subscribe(
      (data) => {
        console.log('Bookmark Post: ', data.data);
        this.listPost = data.data;
        this.listPost.reverse();
      }
    )
  }

  //bookmark

  bookmarkPost(post_id: number) {
    this.postService.bookmarkPost(post_id).subscribe(
      (response) => {
        this.listPost = this.listPost.filter(item => item.id !== post_id);
      });
  }

  //bookmark

  //share

  dialogShare: number = 0;
  shareSuccess: string = '';

  showShare(post_id: number) {
    this.dialogShare = post_id;
    this.shareSuccess = '';
  }

  copyUrl(post_id: number) {
    const postShare = this.listPost.find((item: any) => item.id == post_id);

    navigator.clipboard.writeText(`${window.location.origin}/friend-profile/${postShare.profile.id}/${post_id}`)
      .then(() => {
        this.shareSuccess =
          `<p class="validation-message validation-sucess text-body text-primary py-10 px-15">
          <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
          <span>Đã sao chép đường dẫn vào bộ nhớ tạm!</span>
        </p>`;
      })
      .catch((error) => {
        this.shareSuccess =
          `<p class="validation-message validation-critical text-body text-primary py-10 px-15">
          <i class="icon-size-16 icon icon-ic_fluent_dismiss_circle_16_filled"></i>
          <span>Sao chép không thành công!</span>
        </p>`;
      });
  }

  sharePostToMessage(post_id: number, conversation_id: number, username: string) {

    const postShare = this.listPost.find((item: any) => item.id == post_id);

    const formData = new FormData();
    formData.append('conversation_id', conversation_id.toString());
    formData.append('content', postShare.content);
    formData.append('link', `/friend-profile/${postShare.profile.id}/${post_id}`);

    if (postShare.post_type == "with_media") {
      formData.append('medias', postShare.medias[0].path);
      formData.append('type', postShare.medias[0].type);
    }

    this.chatService.sendMessage(formData).subscribe(
      (response: any) => {
        console.log(response);
        this.shareSuccess =
          `<p class="validation-message validation-sucess text-body text-primary py-10 px-15">
          <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
          <span>Bạn đã chia sẽ đến ${username}!</span>
        </p>`;
      }
    );
  }

  sharePostToMyPage(post_id: number) {
    this.postService.sharePostToMyPage(post_id).subscribe(
      (response: any) => {
        console.log(response);

        const shared = this.listPost.find(item => item.id === post_id);
        shared.shared = !shared.shared;
        shared.shared_by.unshift(this.currentUser);

        if (shared.shared) {
          shared.shares_count++;
          this.shareSuccess =
            `<p class="validation-message validation-sucess text-body text-primary py-10 px-15">
            <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
            <span>Bạn đã chia sẽ đến trang cá nhân của mình!</span>
          </p>`
        }
        else {
          shared.shares_count--;
          this.shareSuccess =
            `<p class="validation-message validation-critical text-body text-primary py-10 px-15">
            <i class="icon-size-16 icon icon-ic_fluent_dismiss_circle_16_filled"></i>
            <span>Bạn đã hủy chia sẽ bài viết này!</span>
          </p>`;
        }
      }
    )
  }

  //share

}
