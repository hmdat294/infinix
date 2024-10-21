import { Component } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { CommonModule } from '@angular/common';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [NavComponent, CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  listPost:any;
  constructor(private adminService: AdminService) { }
  ngOnInit(): void {
    this.adminService.getPost().subscribe(
      (response) => {
        // Gán mảng `data` từ response vào `listPost`
        this.listPost = response.data;
        console.log(this.listPost);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }
}
