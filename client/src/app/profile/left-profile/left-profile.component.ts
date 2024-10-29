import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './left-profile.component.html',
  styleUrl: './left-profile.component.css'
})
export class LeftProfileComponent implements OnInit {
  
  user: any;
  images: any;
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.authService.getUser(0).subscribe(
      (response) => {
        this.user = response.data;
        console.log(this.user);

        this.authService.getImageByUser(this.user.id).subscribe(
          (response) => {
            this.images = response.data;
            console.log(this.images);
          }
        )
      });

  }

  zoomImg: string = '';

  setZoomIng(img: string) {
    this.zoomImg = img;
  }
}
