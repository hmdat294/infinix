import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) { }

  login(value: any) {
    // console.log(value.value);

    this.authService.login(value.value).subscribe(
      (response) => {
        console.log('Login successful', response);
        if (response.token) {

          localStorage.setItem('auth_token', response.token);
          this.router.navigate(['/']);
          setTimeout(() => location.reload(), 50);

        } else {
          // alert('Đăng nhập thất bại, tài khoản hoặc mật khẩu không chính xác!');
        }
      }
    );
  }
}
