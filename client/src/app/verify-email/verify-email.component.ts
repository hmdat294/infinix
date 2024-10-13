import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      const hash = params.get('hash');

      if (id && hash) {
        this.authService.verifyEmail(id, hash).subscribe(
          () => {
            this.message = 'Email verified successfully!';
            this.router.navigate(['/login']);
            console.log(this.message);
            
          },
          (error) => {
            this.message = 'Email verification failed.';
            console.log(error);
          }
        );
      }
    });
  }
}
