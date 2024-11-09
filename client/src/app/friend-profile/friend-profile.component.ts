import { ChangeDetectorRef, Component, ElementRef, inject, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PostService } from '../service/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { AuthService } from '../service/auth.service';
import { CarouselService } from '../service/carousel.service';
import { EventService } from '../service/event.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChatService } from '../service/chat.service';
import { MiniChatComponent } from '../mini-chat/mini-chat.component';

@Component({
  selector: 'app-friend-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './friend-profile.component.html',
  styleUrl: './friend-profile.component.css'
})
export class FriendProfileComponent implements OnInit {

  selectedFilesComment: File[] = [];
  previewCommentImages: string[] = [];
  listPost: any[] = [];
  fileComment: any;
  showPoll: boolean = false;
  poll_input: any[] = [];
  spaceCheck: any = /^\s*$/;
  idDialog: number = 0;
  commentByPostId: any[] = [];
  user: any;
  images: any;
  conversation: any[] = [];
  post_id: number = 0;
  currentUser: any;
  listUser: any;
  listGroup: any;
  friendOfFriend: any;
  friendOfFriendLimit: any;
  showMoreFriend: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private postService: PostService,
    private carouselService: CarouselService,
    private eventService: EventService,
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      const user_id = params['user_id'];
      this.post_id = params['post_id'];

      if (user_id > 0) {
        this.authService.getUser(0).subscribe(
          (data) => {
            this.currentUser = data.data;
          });

        this.authService.getUser(user_id).subscribe(
          (response) => {
            this.user = response.data;
            console.log(this.user);

            this.authService.getImageByUser(this.user.id).subscribe(
              (response) => {
                this.images = response.data;
              });

            this.authService.getFriendOfFriend(this.user.id).subscribe(
              (response) => {
                // console.log(response);
                this.friendOfFriend = response.data;
                this.friendOfFriendLimit = response.data.slice(0, 9);
              });
          });

        this.postService.getPostByUser(user_id).subscribe(
          (data) => {
            this.listPost = data.data;

            if (this.post_id > 0) {
              this.listPost = this.listPost.filter((item: any) => item.id == this.post_id);
            }
            // console.log(this.listPost);

            this.eventService.bindEvent('App\\Events\\UserPostEvent', (data: any) => {
              console.log('Post event:', data);
              this.listPost.unshift(data.data);
            });

            this.eventService.bindEvent('App\\Events\\UserBlockUserEvent', (data: any) => {
              console.log('Block event:', data);
            });

            this.eventService.bindEvent('App\\Events\\FriendRequestEvent', (data: any) => {
              console.log('Friend request event:', data);
            });
          });

        this.chatService.getListChat().subscribe(
          (response) => {
            this.listUser = response.data.filter((item: any) => item.is_group == 0);
            this.listGroup = response.data.filter((item: any) => item.is_group == 1);
          });
      }
      else this.router.navigate(['/profile']);

    });

    // this.conversation = JSON.parse(localStorage.getItem('conversation') || '[]');

    this.chatService.conversation$.subscribe(conversation => {
      // console.log('Updated conversation from localStorage:', conversation);
      this.conversation = conversation;
    });
  }

  createChat(receiver_id: number) {
    this.chatService.getMessageUser(receiver_id).subscribe(
      (response: any) => {
        console.log(response);

        if (this.conversation.includes(response.data.id)) {
          this.conversation = this.conversation.filter(id => id !== response.data.id);
        }

        if (this.conversation.length >= 5) {
          this.conversation.shift();
        }

        this.conversation.push(response.data.id);

        this.chatService.updateConversation(this.conversation);
        this.chatService.tagOpenBoxChat = true;
      });
  }

  @ViewChild('commentInput') commentInput!: ElementRef;
  @ViewChildren('carouselInner') carouselInners!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('nextButton') nextButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('prevButton') prevButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('indicatorsContainer') indicatorsContainers!: QueryList<ElementRef<HTMLDivElement>>;

  ngAfterViewInit(): void {
    this.initCarousels();
  }

  initCarousels(): void {
    const posts = this.listPost.filter((item: any) => item.post_type === "with_media");

    this.carouselInners.forEach((carouselInner, index) => {
      const nextButton = this.nextButtons.toArray()[index];
      const prevButton = this.prevButtons.toArray()[index];
      const indicators = this.indicatorsContainers.toArray()[index].nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

      this.carouselService.initCarousel(posts[index].id, carouselInner, nextButton, prevButton, indicators);
    });
  }

  goSlide(postId: number, slideIndex: number): void {
    this.carouselService.goSlide(postId, slideIndex);
  }

  toggleDialog(post_id: number, slideIndex: number = 0) {
    this.idDialog = post_id;
    this.eventService.setPostId(post_id);

    if (this.idDialog == 0) {
      this.commentByPostId[post_id] = null;
    }
    else {
      this.postService.getComment(post_id).subscribe(
        (response) => {

          this.commentByPostId[post_id] = response.data;
          this.goSlide(post_id, slideIndex)

          this.eventService.bindEventPost('App\\Events\\UserCommentPostEvent', (data: any) => {
            this.listPost.find(item => item.id === data.data.post.id).comments_count = data.comments_count;
            this.getCommentByPostId(data.data.post.id).unshift(data.data);
            console.log('Comment event:', data);
          });

          this.eventService.bindEventPost('App\\Events\\UserLikePostEvent', (data: any) => {
            this.listPost.find(item => item.id === data.data.id).likes_count = data.likes_count;
            console.log('Like event:', data);
          });

        })
    }

    this.cdr.detectChanges();
    this.initCarousels();
  }

  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => {
        console.log(response);

        if (this.user.id == receiver_id) {
          this.user.is_sent_friend_request = !this.user.is_sent_friend_request;
        }
        else {
          const friendfriend = this.friendOfFriend.find((item: any) => item.id === receiver_id);
          friendfriend.is_sent_friend_request = !friendfriend.is_sent_friend_request;
        }
      });
  }

  unFriend(user_id: number): void {
    this.authService.unFriend(user_id).subscribe(
      (response) => {
        console.log(response);
      });
  }

  cancelRequest(receiver_id: number) {
    this.authService.acceptFriend({ id: receiver_id, status: 'rejected' }).subscribe(
      (response) => {
        console.log(response);
      });
  }

  viewMoreFriend() {
    this.showMoreFriend = !this.showMoreFriend;
  }

  goToFriend(user_id: number) {
    this.showMoreFriend = false;
    this.router.navigate(['/friend-profile', user_id]);
  }

  getPathImg(img: any) {
    return img.path;
  }

  getCommentByPostId(post_id: number) {
    return this.commentByPostId[post_id];
  }

  postComment(value: any) {
    const formData = new FormData();
    formData.append('content', value.content);
    formData.append('post_id', value.post_id);

    if (this.selectedFilesComment.length > 0)
      formData.append('media', this.selectedFilesComment[0], this.selectedFilesComment[0].name);

    this.postService.postComment(formData).subscribe(
      (response) => {
        console.log(response);
        this.commentInput.nativeElement.value = '';
        this.removeCommentImage();
      }
    )
  }

  likePost(post_id: number) {
    this.postService.likePost(post_id).subscribe(
      (response) => {
        const post = this.listPost.find(item => item.id === post_id);
        if (response.liked) post.likes_count++;
        else post.likes_count--;
        post.liked = response.liked;

        console.log(response);
      }
    )
  }

  //bookmark

  bookmarkPost(post_id: number) {
    this.postService.bookmarkPost(post_id).subscribe(
      (response) => {
        console.log(response);

        const bookmark = this.listPost.find(item => item.id === post_id);
        bookmark.bookmarked = !bookmark.bookmarked;
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

  //report

  diaLogReport: number = 0;
  valueReport: string[] = [];
  contentReport: string = '';
  messageReport: string = '';
  @ViewChild('checkboxesContainer') checkboxesContainer!: ElementRef;

  showDialogReport(id: any) {

    this.diaLogReport = id;
    if (this.diaLogReport == 0) {
      this.valueReport = [];
      this.contentReport = '';
      this.messageReport = '';

      this.checkboxesContainer.nativeElement.querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox: HTMLInputElement) => checkbox.checked = false);
    }
  }

  onCheckboxChange(event: any) {
    const checkboxValue = event.target.value;

    if (event.target.checked) this.valueReport.push(checkboxValue);
    else this.valueReport = this.valueReport.filter(value => value !== checkboxValue);
  }

  listIdPostReport: number[] = [];

  postReport(value: any): any {

    const valueReport = this.valueReport.join(', ');
    let content = '';

    if (valueReport != '' && value.contentReport != '') content = [valueReport, value.contentReport].join(', ');
    else if (valueReport != '') content = valueReport;
    else if (value.contentReport != '') content = value.contentReport;
    else return false;

    content = content.charAt(0).toUpperCase() + content.slice(1).toLowerCase() + '.';

    const valuePost: any = this.diaLogReport;
    valuePost.content = content;

    this.postService.postReport(valuePost).subscribe(
      (response: any) => {
        console.log(response);

        this.listIdPostReport.push(response.data.post_id);

        this.messageReport =
          `<p class="validation-message validation-sucess text-body text-primary pt-15 px-20">
              <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
              <span>Gửi báo cáo thành công.</span>
          </p>`;
        this.showDialogReport(0);
      })
  }

  cancelReport(post_id: number) {
    this.postService.cancelReport(post_id).subscribe(
      (response: any) => {
        console.log(response);
        this.listIdPostReport = this.listIdPostReport.filter((id: number) => id !== post_id);
      }
    )
  }

  //report

  //block

  blockUser(user_id: number) {
    this.authService.postUserBlock(user_id).subscribe(
      (response: any) => {
        console.log(response);

        if (this.user.id == user_id) {
          this.user.blocked_user = !this.user.blocked_user;
        }

        this.chatService.getMessageUser(user_id).subscribe(
          (response: any) => {
            this.conversation = this.conversation.filter(id => id !== response.data.id);
            this.chatService.updateConversation(this.conversation);
            this.chatService.tagOpenBoxChat = false;
          });
      });
  }

  //block

  showPolls() {
    this.showPoll = (this.showPoll == false) ? true : false;
    this.poll_input = [];
  }

  removeChoice(index: number): void {
    this.poll_input.splice(index, 1);
  }

  trackByFn(index: number, item: string) {
    return index;
  }

  onFileCommentSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    console.log(files);

    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewCommentImages = [reader.result as string];
    reader.readAsDataURL(file);
    this.selectedFilesComment = [file];
  }
  removeCommentImage(): void {
    this.previewCommentImages = [];
    this.selectedFilesComment = [];
    if (this.fileComment) this.fileComment.nativeElement.value = '';
  }

  formatTime(dateString: string): string {
    const givenTime = moment(dateString);
    const currentTime = moment();
    const diffInHours = currentTime.diff(givenTime, 'hours');
    const diffInMinutes = currentTime.diff(givenTime, 'minutes');

    if (diffInHours >= 12) return givenTime.format('YYYY-MM-DD');
    else if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    else return `${diffInHours} giờ trước`;
  }

  zoomImg: string = '';

  setZoomIng(img: string) {
    this.zoomImg = img;
  }
}
