import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../service/event.service';
import { TranslateModule } from '@ngx-translate/core';

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

          // const requiredPermissions = ['can_login', 'can_create_post', 'can_comment', 'can_send_message', 'can_access_dashboard'];


          this.authService.getUser(0).subscribe(
            (response) => {

              const isLogin = this.authService.checkPermissions('can_login', response.data.permissions);
              const isAdmin = this.authService.checkPermissions('can_access_dashboard', response.data.permissions);
              
              if (isLogin) {
                this.authService.updateAuthToken(response.token);

                if (isAdmin) this.router.navigate(['/admin']);
                else this.router.navigate(['/']);
                
              } else this.error = 'Tài khoản đã bị khóa, gửi hỗ trợ để biết thêm thông tin!';

            });

        } else this.error = response.message;
      }
    );
  }
}
