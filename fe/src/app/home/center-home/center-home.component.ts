import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../post.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-center-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './center-home.component.html',
  styleUrl: './center-home.component.css'
})
export class CenterHomeComponent implements OnInit {

  content: string = '';
  selectedFilesPost: File[] = [];
  previewPostImages: string[] = [];
  listPost: any;

  constructor(private postService: PostService) { }

  ngOnInit(): void {

    this.postService.getPost().subscribe(
      (data) => {
        this.listPost = data;
        console.log(this.listPost);
      }
    )

  }

  post(value: any) {

    const formData = new FormData();
    formData.append('content', value.content);
    if (this.selectedFilesPost.length > 0) {
      this.selectedFilesPost.forEach(image => {
        formData.append('medias[]', image, image.name);
      });
    }

    this.postService.postPost(formData).subscribe(
      (response) => {
        (document.querySelector('.textarea-post') as HTMLTextAreaElement).style.height = '32px';
        this.content = '';
        this.onCancelPostImg();
        console.log(response);
      });
  }

  filePost: any;

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
