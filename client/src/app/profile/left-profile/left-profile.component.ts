import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-left-profile',
  standalone: true,
  imports: [],
  templateUrl: './left-profile.component.html',
  styleUrl: './left-profile.component.css'
})
export class LeftProfileComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    if (localStorage.getItem('auth_token')) {
      this.authService.getUser(0).subscribe(
        (response) => {
          this.user = response;
        });
    }

  }
}
