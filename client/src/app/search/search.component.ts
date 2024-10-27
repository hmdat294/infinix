import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../service/post.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { EventService } from '../service/event.service';
import { CarouselService } from '../service/carousel.service';
import moment from 'moment';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, AfterViewInit {

  valueSearchPosts: any[] = [];
  valueSearchUsers: any[] = [];
  selectedFilesComment: File[] = [];
  previewCommentImages: string[] = [];
  fileComment: any;
  idDialog: number = 0;
  commentByPostId: any[] = [];
  spaceCheck: any = /^\s*$/;
  keyword: string = '';
  tabActive: string = '';

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private postService: PostService,
    private carouselService: CarouselService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.keyword = params['keyword'];
      console.log(this.keyword);

      this.search(this.keyword);

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
    this.carouselInners.forEach((carouselInner, index) => {

      const nextButton = this.nextButtons.toArray()[index];
      const prevButton = this.prevButtons.toArray()[index];
      const indicators = this.indicatorsContainers.toArray()[index].nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

      this.carouselService.initCarousel(carouselInner, nextButton, prevButton, indicators);
    });
  }

  toggleDialog(post_id: number) {
    this.idDialog = post_id;

    if (this.idDialog == 0) {
      this.commentByPostId[post_id] = null;
    }
    else {
      this.postService.getComment(post_id).subscribe(
        (response) => {
          console.log(response);

          this.commentByPostId[post_id] = response.data;

          this.eventService.setPostId(post_id);

          this.eventService.bindEvent('App\\Events\\UserCommentPostEvent', (data: any) => {
            this.valueSearchPosts.find(item => item.id === data.data.post.id).comments_count = data.comments_count;
            this.getCommentByPostId(data.data.post.id).unshift(data.data);
            console.log('Comment event:', data);
          });

          this.eventService.bindEvent('App\\Events\\UserLikePostEvent', (data: any) => {
            this.valueSearchUsers.find(item => item.id === data.data.id).likes_count = data.likes_count;
            console.log('Like event:', data);
          });

        })
    }

    this.cdr.detectChanges();
    this.initCarousels();
  }

  search(keyword: string = this.keyword) {
    this.postService.getSearch(keyword).subscribe(
      (response) => {
        console.log(response);
        this.valueSearchPosts = response.posts;
        this.valueSearchUsers = response.users;
        this.tabActive = 'all';

        this.eventService.bindEvent('App\\Events\\FriendRequestEvent', (data: any) => {
          console.log('Friend request event:', data);
        });
      }
    )
  }

  searchUser(keyword: string = this.keyword) {
    this.postService.getSearchUser(keyword).subscribe(
      (response) => {
        console.log(response);
        this.valueSearchPosts = [];
        this.valueSearchUsers = response.data;
        this.tabActive = 'user';
      }
    )
  }

  searchPost(keyword: string = this.keyword) {
    this.postService.getSearchPost(keyword).subscribe(
      (response) => {
        console.log(response);
        this.valueSearchPosts = response.data;
        this.valueSearchUsers = [];
        this.tabActive = 'post';
      }
    )
  }

  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => {
        console.log(response);
        this.valueSearchUsers.find(item => item.id === receiver_id).is_sent_friend_request = true;
      });
  }

  cancelRequest(receiver_id: number) {
    this.authService.cancelRequest(receiver_id).subscribe(
      (response) => {
        console.log(response);
        this.valueSearchUsers.find(item => item.id === receiver_id).is_sent_friend_request = false;
      });
  }

  //show post

  getCommentByPostId(postId: number) {
    return this.commentByPostId[postId];
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

  getPathImg(img: any) {
    return img.path;
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
        const post = this.valueSearchPosts.find(item => item.id === post_id);
        if (response.liked) post.likes_count++;
        else post.likes_count--;
        post.liked = response.liked;

        console.log(response);
      }
    )
  }

  removeCommentImage(): void {
    this.previewCommentImages = [];
    this.selectedFilesComment = [];
    if (this.fileComment) this.fileComment.nativeElement.value = '';
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
}
