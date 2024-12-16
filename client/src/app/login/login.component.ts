import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../service/event.service';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  error: string = '';
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(value: any) {
    const bg_left = document.querySelector('.bg-page-login-left') as HTMLElement;
    const bg_right = document.querySelector('.bg-page-login-right') as HTMLElement;
    bg_left.classList.add('bg-animation-left');
    bg_right.classList.add('bg-animation-right');

    this.authService.login(value.value).subscribe(
      (response) => {
        console.log(response);
        if (response.token) {

          this.authService.updateAuthToken(response.token);

          this.authService.getUser(0).subscribe(
            (response) => {

              console.log(response.data);

              const isLogin = this.authService.checkPermissions('can_login', response.data.permissions);
              const isAdmin = this.authService.checkPermissions('can_access_dashboard', response.data.permissions);

              if (isLogin) {
                if (isAdmin) this.router.navigate(['/admin']);
                else this.router.navigate(['/']);
              }
              else {

                const canLoginPermission = response.data.permissions.find(
                  (permission: any) => permission.name === "can_login"
                );

                const enableAt = canLoginPermission?.pivot?.enable_at || null;

                this.error = 'Tài khoản đã bị khóa đến ' + moment(enableAt).format('HH:mm:ss [ngày] DD/MM/YYYY');
                this.authService.removeAuthToken();
              }

            });
        } else this.error = response.message;
      }
    );
  }
}
