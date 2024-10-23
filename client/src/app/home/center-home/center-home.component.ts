import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../post.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { CarouselService } from '../../carousel.service';
import { AuthService } from '../../auth.service';
import { EventService } from '../../event.service';

@Component({
  selector: 'app-center-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './center-home.component.html',
  styleUrl: './center-home.component.css'
})
export class CenterHomeComponent implements AfterViewInit {

  content: string = '';
  selectedFilesPost: File[] = [];
  previewPostImages: string[] = [];
  listPost: any[] = [];
  filePost: any;
  showPoll: boolean = false;
  poll_input: any[] = [];
  spaceCheck: any = /^\s*$/;
  idDialog: number = 0;
  commentByPostId: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef, 
    private postService: PostService, 
    private carouselService: CarouselService, 
    private authService: AuthService,
    private eventService: EventService,
  ) { }

  ngOnInit(): void {
    this.postService.getPost().subscribe(
      (data) => {
        this.listPost = data.data;
        console.log(this.listPost);

        this.eventService.bindEvent('App\\Events\\UserPostEvent', (data: any) => {
          console.log('Post event:', data);
          this.listPost.unshift(data.data);
        });

        this.eventService.bindEvent('App\\Events\\UserCommentPostEvent', (data: any) => {
          const post = this.listPost.find(item => item.id === data.data.post.id);
          post.comments_count = data.comment_count;

          this.authService.getUser(0).subscribe(
            (user) => {
              if (user.data.id == data.user_comment.id && !this.getCommentByPostId(data.data.post.id)) {
                this.getComment(data.data.post.id);
                this.commentInput.nativeElement.value = '';
              }
              else
                this.getCommentByPostId(data.data.post.id).unshift(data.data);
            }
          )

          console.log('Comment event:', data);
        });

        this.eventService.bindEvent('App\\Events\\UserLikePostEvent', (data: any) => {
          const post = this.listPost.find(item => item.id === data.data.id);
          post.likes_count = data.like_count;

          console.log('Like event:', data);

        });
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

  getPathImg(img: any) {
    return img.path;
  }

  toggleDialog(id: number) {
    this.idDialog = id;
    // if (!this.commentByPostId[post_id]) {
    //   this.postService.getComment(post_id).subscribe(
    //     (response) => {
    //       this.commentByPostId[post_id] = response.data;
    //     })
    // }
    // else {
    //   this.commentByPostId[post_id] = null;
    // }
    if (this.idDialog == 0) {
      this.commentByPostId[id] = null;
    } else {
      this.postService.getComment(id).subscribe(
        (response) => {
          this.commentByPostId[id] = response.data;
        });
    }
    this.cdr.detectChanges();
    this.initCarousels();
  }

  post(value: any) {

    if (value.content && !this.spaceCheck.test(value.content)) {
      const formData = new FormData();
      formData.append('content', value.content);

      if (this.selectedFilesPost.length > 0)
        this.selectedFilesPost.forEach(image => formData.append('medias[]', image, image.name));

      if (this.poll_input.length > 0) {
        formData.append('end_at', value.end_at);
        formData.append('post_type', 'with_poll');
        this.poll_input.forEach(option => formData.append('poll_option[]', option));
      }

      this.postService.postPost(formData).subscribe(
        (response) => {
          (document.querySelector('.textarea-post') as HTMLTextAreaElement).style.height = '32px';
          this.content = '';
          this.poll_input = [];
          this.showPoll = false;
          this.onCancelPostImg();
          console.log(response);
        });
    }
  }

  getComment(post_id: number): any {
    if (!this.commentByPostId[post_id]) {
      this.postService.getComment(post_id).subscribe(
        (response) => {
          this.commentByPostId[post_id] = response.data;
        })
    }
    else {
      this.commentByPostId[post_id] = null;
    }
  }

  getCommentByPostId(post_id: number) {
    return this.commentByPostId[post_id];
  }

  postComment(value: any) {
    this.postService.postComment(value.value).subscribe(
      (response) => {
        console.log(response);
      }
    )
  }

  likePost(post_id: number) {
    this.postService.likePost(post_id).subscribe(
      (response) => {
        console.log(response);
      }
    )
  }

  showPolls() {
    this.showPoll = (this.showPoll == false) ? true : false;
    this.poll_input = [];
  }

  addChoice(): void {
    this.poll_input.push('');
  }

  removeChoice(index: number): void {
    this.poll_input.splice(index, 1);
  }

  trackByFn(index: number, item: string) {
    return index;
  }

  onFilePostSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    if (files && files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => this.previewPostImages.push(reader.result as string);
        reader.readAsDataURL(file);
        this.selectedFilesPost.push(file);
      });
    }
  }

  onCancelPostImg() {
    this.selectedFilesPost = [];
    this.previewPostImages = [];
    if (this.filePost) this.filePost.nativeElement.value = '';
  }

  removePostImage(index: number): void {
    this.previewPostImages.splice(index, 1);
    this.selectedFilesPost.splice(index, 1);
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

  // Cập nhật height cho textarea theo content, quá 110px thì thành cuộn dọc
  resizeTextarea(event: any): void {
    const textarea = event.target;
    if (textarea.scrollHeight < 110) {
      textarea.style.height = 'fit-content';
      textarea.style.height = textarea.scrollHeight + 'px';
    } else {
      textarea.style.height = '110px';
      textarea.style.overflowY = 'auto';
    }
  }
}
