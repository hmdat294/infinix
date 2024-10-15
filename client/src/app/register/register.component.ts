import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  error: string = '';
  constructor(private authService: AuthService, private router: Router) { }

  checkPasswords(form: NgForm): boolean {
    return form.controls['password'].value === form.controls['confirm'].value;
  }

  register(value: any) {
    this.authService.register(value.value).subscribe(
      (response) => {
        console.log(response);
        if (response.token) this.router.navigate(['/login']);
        else this.error = response.message;
      }
    );
  }

  getCode(email: string) {
    this.authService.getCode(email).subscribe(
      (response) => {
        console.log(response);
        this.stepNext();
        this.error = response.message;
      }
    );
  }

  postCode(email: string, code: number) {
    this.authService.postCode(email, code).subscribe(
      (response) => {
        if (response.verify) {
          console.log(response);
          this.stepNext();
        }
        this.error = response.message;
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
