import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-left-home',
  standalone: true,
  imports: [],
  templateUrl: './left-home.component.html',
  styleUrl: './left-home.component.css'
})
export class LeftHomeComponent implements OnInit{

  userRequest: any = [];

  constructor(private authService: AuthService) {
    
  }

  ngOnInit(): void {
    this.authService.getRequestFriend().subscribe(
      (response) => {
        this.userRequest = response;
        console.log(this.userRequest);
      });
    
  }


}
