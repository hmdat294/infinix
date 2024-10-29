import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PostService } from '../service/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { AuthService } from '../service/auth.service';
import { CarouselService } from '../service/carousel.service';
import { EventService } from '../service/event.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-friend-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './friend-profile.component.html',
  styleUrl: './friend-profile.component.css'
})
export class FriendProfileComponent {

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

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private postService: PostService,
    private carouselService: CarouselService,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const user_id = params['user_id'];

      if (user_id > 0) {
        this.authService.getUser(user_id).subscribe(
          (response) => {
            this.user = response.data;
            console.log(this.user);

          });

        this.postService.getPostByUser(user_id).subscribe(
          (data) => {
            this.listPost = data.data;
            console.log(this.listPost);

            this.eventService.bindEvent('App\\Events\\UserPostEvent', (data: any) => {
              console.log('Post event:', data);
              this.listPost.unshift(data.data);
            });
          });
      }
      else this.router.navigate(['/profile']);


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
      const postId = this.listPost[index].id;// assign the post_id here based on the index or other logic;
      const nextButton = this.nextButtons.toArray()[index];
      const prevButton = this.prevButtons.toArray()[index];
      const indicators = this.indicatorsContainers.toArray()[index].nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

      this.carouselService.initCarousel(postId, carouselInner, nextButton, prevButton, indicators);
    });
  }

  goSlide(postId: number, slideIndex: number): void {
    this.carouselService.goSlide(postId, slideIndex);
  }

  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => {
        console.log(response);
        this.user.is_sent_friend_request = true;
      });
  }

  cancelRequest(receiver_id: number) {
    this.authService.cancelRequest(receiver_id).subscribe(
      (response) => {
        console.log(response);
        this.user.is_sent_friend_request = false;
      });
  }

  getPathImg(img: any) {
    return img.path;
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
            this.listPost.find(item => item.id === data.data.post.id).comments_count = data.comments_count;
            this.getCommentByPostId(data.data.post.id).unshift(data.data);
            console.log('Comment event:', data);
          });

          this.eventService.bindEvent('App\\Events\\UserLikePostEvent', (data: any) => {
            this.listPost.find(item => item.id === data.data.id).likes_count = data.likes_count;
            console.log('Like event:', data);
          });

        })
    }

    this.cdr.detectChanges();
    this.initCarousels();
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

}
