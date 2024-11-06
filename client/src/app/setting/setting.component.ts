import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements OnInit {

  user: any;
  tabSetting: string = 'general-settings';
  tabAccordion: string = '';

  theme: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  language: string = '';
  phone_number: string = '';
  display_name: string = '';
  biography: string = '';
  date_of_birth: string = '';
  address: string = '';
  gender: string = '';

  listUserReport:any;
  listPostReport:any;
  listBlock:any;

  constructor(
    private authService: AuthService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {

    this.theme = localStorage.getItem('theme') || 'light';

    this.authService.getUser(0).subscribe(
      (response) => {
        this.user = response.data;
        // console.log(this.user);
      });


    this.authService.getUserReport().subscribe(
      (response) => {
        console.log('Report:', response);
        this.listUserReport = response.data;
      })

    this.authService.getUserBlock().subscribe(
      (response) => {
        this.listBlock = response.data;
        // console.log(this.listBlock);
      })

  }

  //block

  blockUser(user_id:number){
    this.authService.postUserBlock(user_id).subscribe(
      (response:any) => {
        // console.log(response);
        this.listBlock = this.listBlock.filter((item:any) => item.id !== user_id);
      });
  }

  //block

  tab(tab: string) {
    this.tabSetting = tab;
  }

  tabChild(tab: string) {
    this.tabAccordion = (tab == 'email') ? tab : (this.tabAccordion != tab) ? tab : '';
  }

  selectTheme(currentTheme: string) {
    localStorage.setItem('theme', currentTheme);
    this.renderer.setAttribute(document.documentElement, 'data-theme', localStorage.getItem('theme') || currentTheme);
  }

  checkPasswords(form: NgForm): boolean {
    return form.controls['new_password']?.value === form.controls['confirm']?.value;
  }

  updatePassword(value: any) {
    console.log(value);
    this.authService.updatePassword({
      'old_password': value.old_password,
      'new_password': value.new_password
    }).subscribe(
      (response) => {
        console.log(response);
        this.tabChild('password');
      }
    );
  }

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
          setTimeout(() => this.error1 = '', 3000);
          this.error2 = '';
          this.changeMail = false;
        }
      })
  }

  error1: string = '';
  error2: string = '';

  getCode(email: string) {
    this.authService.getCodeForGot(email).subscribe(
      (response) => {
        console.log(response);
        if (response.verify) {
          this.tabChild('email');
          this.error1 =
            `<p class="validation-message validation-sucess text-body text-primary">
                <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
                <span>${response.message}</span>
            </p>`;
        }
        else {
          this.error1 =
            `<p class="validation-message validation-critical text-body text-primary">
                <i class="icon-size-16 icon icon-ic_fluent_dismiss_circle_16_filled"></i>
                <span>${response.message}</span>
            </p>`;
        }
      }
    );
  }

  changeMail: boolean = false;

  postCode(email: string, code: number) {
    this.authService.postCode(email, code).subscribe(
      (response) => {
        console.log(response);
        if (response.verify) {
          this.changeMail = true;
          this.error2 =
            `<p class="validation-message validation-sucess text-body text-primary">
                <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
                <span>${response.message}</span>
            </p>`;
        }
        else {
          this.error2 =
            `<p class="validation-message validation-critical text-body text-primary">
                <i class="icon-size-16 icon icon-ic_fluent_dismiss_circle_16_filled"></i>
                <span>${response.message}</span>
            </p>`;
        }
      }
    );
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
