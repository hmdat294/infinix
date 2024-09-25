import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) { }

  login(value: any) {
    this.authService.login(value).subscribe(
      (response) => {
        if (response.token) {

          console.log('Login successful', response);
          localStorage.setItem('auth_token', response.token);
          this.router.navigate(['/']);
          setTimeout(() => location.reload(), 50);

        } else {
          console.log('Đăng nhập thất bại!');
        }
      },
      (error) => {
        console.log('Chưa nhập đủ thông tin!');
        console.error('Login failed', error);
      }
    );
  }
}
