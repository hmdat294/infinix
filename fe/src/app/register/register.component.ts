import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
        this.router.navigate(['/']);
        alert('Đăng ký thành công!');
      },
      (error) => {
        alert('Đăng ký thất bại, Email đã tồn tại!');
      }
    );
  }
}
