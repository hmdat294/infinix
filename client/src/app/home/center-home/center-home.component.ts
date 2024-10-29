import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../service/post.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { CarouselService } from '../../service/carousel.service';
import { AuthService } from '../../service/auth.service';
import { EventService } from '../../service/event.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-center-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './center-home.component.html',
  styleUrl: './center-home.component.css'
})
export class CenterHomeComponent implements OnInit, AfterViewInit {

  content: string = '';
  selectedFilesPost: File[] = [];
  previewPostImages: string[] = [];
  selectedFilesComment: File[] = [];
  previewCommentImages: string[] = [];
  listPost: any[] = [];
  filePost: any;
  fileComment: any;
  showPoll: boolean = false;
  poll_input: any[] = [];
  spaceCheck: any = /^\s*$/;
  idDialog: number = 0;
  commentByPostId: any[] = [];
  currentUser: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private postService: PostService,
    private carouselService: CarouselService,
    private eventService: EventService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.postService.getPost().subscribe(
      (data) => {
        this.listPost = data.data;

        this.eventService.bindEvent('App\\Events\\UserPostEvent', (data: any) => {
          console.log('Post event:', data);
          this.listPost.unshift(data.data);
        });

      });

    this.authService.getUser(0).subscribe(
      (data) => {
        this.currentUser = data.data;
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


  getCommentByPostId(post_id: number) {
    return this.commentByPostId[post_id];
  }

  getPathImg(img: any) {
    return img.path;
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

  onFileCommentSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    console.log(files);

    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewCommentImages = [reader.result as string];
    reader.readAsDataURL(file);
    this.selectedFilesComment = [file];
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
