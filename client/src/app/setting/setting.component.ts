import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  username: string = '';
  email: string = '';
  password: string = '';
  theme: string = '';
  language: string = '';
  phone_number: string = '';
  display_name: string = '';
  biography: string = '';
  date_of_birth: string = '';
  address: string = '';
  gender: string = '';

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {

    this.authService.getUser(0).subscribe(
      (response) => {
        this.user = response.data;
        console.log(this.user);

      });

  }

  tab(tab: string) {
    this.tabSetting = tab;
  }

  tabChild(tab: string) {
    this.tabAccordion = (this.tabAccordion != tab) ? tab : '';
  }

  updateUser(value: any) {

    // console.log(this.user.id);
    // console.log(value);

    this.authService.updateUser(this.user.id, value).subscribe(
      (response) => {
        console.log(response);
        this.tabAccordion = '';
      })
  }


  fileProfile: any;
  selectedFilesProfile: File[] = [];
  previewProfileImages: string[] = [];

  onFileImageProfileSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    console.log(files);

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
    console.log(files);

    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewCoverImages = [reader.result as string];
    reader.readAsDataURL(file);
    this.selectedFilesCover = [file];

    const formData = new FormData();
    if (this.selectedFilesCover.length > 0)
      formData.append('corver_photo', this.selectedFilesCover[0], this.selectedFilesCover[0].name);
    this.updateUser(formData);
  }

}
