import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-content.component.html',
  styleUrl: './admin-content.component.css'
})
export class AdminContentComponent {
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
