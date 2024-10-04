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

  constructor(private authService: AuthService, private router: Router) { }

  checkPasswords(form: NgForm): boolean {
    return form.controls['password'].value === form.controls['confirm'].value;
  }

  register(value: any) {
    this.authService.register(value.value).subscribe(
      (response) => {
        console.log('Register successful', response);
        localStorage.setItem('auth_token_register', response.token);

        this.router.navigate(['/login']);
        // alert('Đăng ký thành công!');
      },
      (error) => {
        // alert('Đăng ký thất bại, Email đã tồn tại!');
      }
    );
  }

  step_index: number = 1;

  step() {
    
    const form = document.querySelector('#step_' + this.step_index) as HTMLElement;
    if (form) {
      form.classList.add('step-hidden');
      form.addEventListener('transitionend', () => this.step_index++, { once: true });
    }
    
  }
}
