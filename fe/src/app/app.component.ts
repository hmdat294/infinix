import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  user: any;

  constructor(private authService: AuthService) {
    if (localStorage.getItem('auth_token')) {

      this.authService.getUser().subscribe(
        (response) => {
          this.user = response;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
     
    }
  }

  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logout Success:', response);
        // Xóa token khỏi localStorage
        localStorage.removeItem('auth_token');
        location.reload();
      },
      (error) => {
        console.error('Logout Error:', error);
      }
    );
  }

}
