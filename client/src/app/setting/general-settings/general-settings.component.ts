import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../service/post.service';
import { SettingService } from '../../service/setting.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.css'
})
export class GeneralSettingsComponent implements OnInit {

  user: any;
  tabAccordion: string = '';
  display_name: string = '';
  biography: string = '';
  date_of_birth: string = '';

  listUserReport: any;
  listPostReport: any;
  listBlock: any;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private settingService: SettingService,
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    this.authService.getUser(0).subscribe(
      (response) => {
        this.user = response.data;
        // console.log(this.user);
      });

    this.authService.getUserReport().subscribe(
      (response) => {
        // console.log('Report:', response);
        this.listPostReport = response.data.filter((item: any) => item.type == "post");
        this.listUserReport = response.data.filter((item: any) => item.type == "user");

        console.log(this.listPostReport);
        console.log(this.listUserReport);

      })

    this.authService.getUserBlock().subscribe(
      (response) => {
        // console.log('Block:', response);
        this.listBlock = response.data;
        // console.log(this.listBlock);
      })
  }

  report_id: number = 0;
  viewReport(id: number) {
    this.report_id = id;
  }

  blockUser(user_id: number) {
    this.authService.postUserBlock(user_id).subscribe(
      (response: any) => {
        console.log(response);
        this.listBlock = this.listBlock.filter((item: any) => item.id !== user_id);
      });
  }

  cancelReport(report_id: number, type: string) {
    this.postService.cancelReport(report_id).subscribe(
      (response: any) => {
        console.log(response);
        if (type == 'post') {
          this.listPostReport = this.listPostReport.filter((id: any) => id.id !== report_id);
        }
        else if (type == 'user') {
          this.listUserReport = this.listUserReport.filter((id: any) => id.id !== report_id);
        }
      }
    )
  }

  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

  error1: string = '';
  error2: string = '';

  updateUser(value: any) {
    this.authService.updateUser(value).subscribe(
      (response) => {
        console.log(response);
        this.tabAccordion = '';

        if (value.email) {
          this.error1 =
            `<p class="validation-message validation-sucess text-body text-primary">
                <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
                <span>Đổi email thành công!</span>
            </p>`;
          setTimeout(() => this.error1 = '', 2000);
          this.error2 = '';
          this.tabChild('');
        }
      })
  }

  fileProfile: any;
  selectedFilesProfile: File[] = [];
  previewProfileImages: string[] = [];

  onFileImageProfileSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewProfileImages = [reader.result as string];
    reader.readAsDataURL(file);
    this.selectedFilesProfile = [file];

    const formData = new FormData();
    if (this.selectedFilesProfile.length > 0)
      formData.append('profile_photo', this.selectedFilesProfile[0], this.selectedFilesProfile[0].name);
    this.updateUser(formData);
  }

  fileCover: any;
  selectedFilesCover: File[] = [];
  previewCoverImages: string[] = [];

  onFileImageCoverSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewCoverImages = [reader.result as string];
    reader.readAsDataURL(file);
    this.selectedFilesCover = [file];

    const formData = new FormData();
    if (this.selectedFilesCover.length > 0)
      formData.append('cover_photo', this.selectedFilesCover[0], this.selectedFilesCover[0].name);
    this.updateUser(formData);
  }

}
