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
  phonenumber: string = '';
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
}
