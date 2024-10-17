import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  error: string = '';
  constructor(private authService: AuthService, private router: Router) { }

  login(value: any) {
    this.authService.login(value.value).subscribe(
      (response) => {
        console.log(response);
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this.router.navigate(['/']);
          setTimeout(() => location.reload(), 50);
        } else this.error = response.message;
      }
    );
  }
}
