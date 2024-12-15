import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
    selector: 'app-header-admin',
    imports: [],
    templateUrl: './header-admin.component.html',
    styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent implements OnInit {

  user: any;

  constructor(private authService: AuthService) { }
  
  ngOnInit(): void {
    this.authService.getUser(0).subscribe(
      (response) => {
        this.user = response.data;
        console.log(this.user);
      });
  }
}
