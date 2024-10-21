import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../post.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { CarouselService } from '../../carousel.service';

@Component({
  selector: 'app-center-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './center-home.component.html',
  styleUrl: './center-home.component.css'
})
export class CenterHomeComponent implements OnInit, AfterViewInit {

  content: string = '';
  selectedFilesPost: File[] = [];
  previewPostImages: string[] = [];
  listPost: any;
  filePost: any;
  showPoll: boolean = false;
  poll_input: any[] = [];
  spaceCheck: any = /^\s*$/;
  idDialog: number = 0;

  constructor(private postService: PostService, private carouselService: CarouselService) {}

  ngOnInit(): void {
    this.postService.getPost().subscribe(
      (data) => {
        this.listPost = data.data;
        console.log(this.listPost);

        this.postService.bindEventPost('App\\Events\\UserPostEvent', (data: any) => {
          console.log('Post event:', data);
          this.listPost.unshift(data.data);
        });
      });
  }

  @ViewChildren('carouselInner') carouselInners!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('nextButton') nextButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('prevButton') prevButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('indicatorsContainer') indicatorsContainers!: QueryList<ElementRef<HTMLDivElement>>;

  ngAfterViewInit(): void {
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
    return index; // Sử dụng index để theo dõi các phần tử
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
}
