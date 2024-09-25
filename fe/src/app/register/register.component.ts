import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router: Router) { }

  register(value: any) {
    this.authService.register(value).subscribe(
      (response) => {
        console.log('Register successful', response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Register failed', error);
      }
    );
  }
}
