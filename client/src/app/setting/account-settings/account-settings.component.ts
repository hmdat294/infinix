import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { SettingService } from '../../service/setting.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent implements OnInit {

  user:any;
  username: string = '';
  email: string = '';
  password: string = '';
  phone_number: string = '';
  language: string = '';
  address: string = '';
  gender: string = '';
  tabAccordion: string = '';

  constructor(
    private authService: AuthService,
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
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

  error1: string = '';
  error2: string = '';
  error3: string = '';

  updateUser(value: any) {
    this.authService.updateUser(value).subscribe(
      (response) => {
        console.log(response);
        this.tabChild('');

        if (value.email) {
          this.error1 =
            `<p class="validation-message validation-sucess text-body text-primary">
                <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
                <span>Đổi email thành công!</span>
            </p>`;
          setTimeout(() => this.error1 = '', 2000);
          this.error2 = '';
        }
      })
  }
  
  updatePassword(value: any) {
    console.log(value);
    this.authService.updatePassword({
      'old_password': value.old_password,
      'new_password': value.new_password
    }).subscribe(
      (response) => {
        console.log(response);
        if (response.status) {
          this.error3 =
            `<p class="validation-message validation-sucess text-body text-primary">
                <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
                <span>${response.message}</span>
            </p>`;
          setTimeout(() => {
            this.error3 = '';
            this.tabChild('');
          }, 2000);
        } else {
          this.error3 =
            `<p class="validation-message validation-critical text-body text-primary">
                <i class="icon-size-16 icon icon-ic_fluent_dismiss_circle_16_filled"></i>
                <span>${response.message}</span>
            </p>`;
        }
      }
    );
  }

  checkPasswords(form: NgForm): boolean {
    return form.controls['new_password']?.value === form.controls['confirm']?.value;
  }

  
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

  postCode(email: string, code: number) {
    this.authService.postCode(email, code).subscribe(
      (response) => {
        console.log(response);
        if (response.verify) {
          this.tabChild('verify-code');
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

}
