import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-forgot-password',
    imports: [FormsModule, RouterModule, CommonModule, TranslateModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  error: string = '';
  constructor(private authService: AuthService, private router: Router) { }

  checkPasswords(form: NgForm): boolean {
    return form.controls['password']?.value === form.controls['confirm']?.value;
  }

  changePassword(value: any) {
    // console.log(value.value);

    const bg_left = document.querySelector('.bg-page-login-left') as HTMLElement;
    const bg_right = document.querySelector('.bg-page-login-right') as HTMLElement;
    bg_left.classList.add('bg-animation-left');
    bg_right.classList.add('bg-animation-right');

    this.authService.forgotPassword(value.value).subscribe(
      (response) => {
        // console.log(response);
        this.router.navigate(['/login']);
        // if (response.token) {
        //   localStorage.setItem('auth_token', response.token);
        //   this.authService.getUser(0).subscribe(
        //     (response) => {
        //       if (response.data.permissions[4]) this.router.navigate(['/admin']);
        //       else this.router.navigate(['/']);
        //     });
        // }
      }
    );
  }

  getCode(email: string) {
    this.authService.getCodeForGot(email).subscribe(
      (response) => {
        // console.log(response);
        if (response.verify) {
          this.stepNext();
          this.error =
            `<p class="validation-message validation-sucess text-body text-primary">
                <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
                <span>${response.message}</span>
            </p>`;
        }
        else {
          this.error =
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
        // console.log(response);
        if (response.verify) {
          this.stepNext();
          this.error =
            `<p class="validation-message validation-sucess text-body text-primary">
                <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
                <span>${response.message}</span>
            </p>`;
        }
        else {
          this.error =
            `<p class="validation-message validation-critical text-body text-primary">
                <i class="icon-size-16 icon icon-ic_fluent_dismiss_circle_16_filled"></i>
                <span>${response.message}</span>
            </p>`;
        }
      }
    );
  }

  step_index: number = 1;

  stepNext() {
    const currentForm = document.querySelector('.step_' + this.step_index) as HTMLElement;
    if (currentForm) {
      currentForm.classList.add('step-hidden-next');
      currentForm.addEventListener('transitionend', () => {
        this.step_index++;
        const nextForm = document.querySelector('.step_' + this.step_index) as HTMLElement;
        if (nextForm) nextForm.classList.remove('step-hidden-next', 'step-hidden-prev');
      }, { once: true });
    }
  }

  stepPrev() {
    const currentForm = document.querySelector('.step_' + this.step_index) as HTMLElement;
    if (currentForm) {
      currentForm.classList.add('step-hidden-prev');
      currentForm.addEventListener('transitionend', () => {
        this.step_index--;
        const previousForm = document.querySelector('.step_' + this.step_index) as HTMLElement;
        if (previousForm) previousForm.classList.remove('step-hidden-prev', 'step-hidden-next');
      }, { once: true });
    }
  }

}
