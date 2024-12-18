import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../service/post.service';
import { SettingService } from '../../service/setting.service';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-general-settings',
    imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
    templateUrl: './general-settings.component.html',
    styleUrl: './general-settings.component.css'
})
export class GeneralSettingsComponent implements OnInit {

  user: any;
  tabAccordion: string = '';
  display_name: string = '';
  biography: string = '';
  date_of_birth: string = '';
  address: string = '';

  listUserReport: any;
  listPostReport: any;
  listCommentReport: any;
  listBlock: any;
  lang: string = '';

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private settingService: SettingService,
    private el: ElementRef,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.lang = localStorage.getItem('language') || 'vi';

    this.authService.getUser(0).subscribe(
      (response) => this.user = response.data);

    this.authService.getUserReport().subscribe(
      (response) => {
        // console.log('Report:', response);
        this.listPostReport = response.data.filter((item: any) => item.type == "post");
        this.listUserReport = response.data.filter((item: any) => item.type == "user");
        this.listCommentReport = response.data.filter((item: any) => item.type == "comment");

        console.log(this.listPostReport);
        
      })

    this.authService.getUserBlock().subscribe(
      (response) => {
        this.listBlock = response.data;
      })
  }

  // Hàm chuyển đổi ngôn ngữ
  switchLanguage() {
    localStorage.setItem('language', this.lang);
    this.translate.use(this.lang);
  }

  isAgeValid(): boolean {
    if (!this.date_of_birth) {
      return false;
    }
    const dob = new Date(this.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // Kiểm tra chính xác tuổi
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1 >= 16;
    }
    return age >= 16;
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
        else if (type == 'comment') {
          this.listCommentReport = this.listCommentReport.filter((id: any) => id.id !== report_id);
        }
      });
  }

  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  }
  
  stripHtmlTags(content: string): string {
    const div = document.createElement('div');
    div.innerHTML = content;
    return div.textContent || div.innerText || '';
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
        this.tabChild('');

        if (value.display_name) {
          this.settingService.updateValue({ 'display_name': value.display_name });
        }
      })
  }

  updateAddress(form: any) {
    this.address = [form.detail, form.ward, form.district, form.province].join(' | ');

    this.updateUser({ 'address': this.address })
  }

  fileProfile: any;
  selectedFilesProfile: File[] = [];
  previewProfileImages: string[] = [];

  onFileImageProfileSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => {

      this.previewProfileImages = [reader.result as string];
      this.settingService.updateValue({ 'profile_photo': this.previewProfileImages[0] });

    };
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
