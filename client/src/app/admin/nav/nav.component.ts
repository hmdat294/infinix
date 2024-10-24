import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

  }

  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logout Success:', response);
        localStorage.removeItem('auth_token');
        this.router.navigate(['/landing-page']);
        // location.reload();
      },
      (error) => {
        console.error('Logout Error:', error);
      }
    );
  }
}
