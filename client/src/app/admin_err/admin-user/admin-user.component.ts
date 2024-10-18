import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.css'
})
export class AdminUserComponent implements OnInit {
  listUser:any;
  constructor(private adminService: AdminService) { }
  ngOnInit(): void {
    this.adminService.getUser().subscribe(
      (response) => {
        // Gán mảng `data` từ response vào `listUser`
        this.listUser = response.data;
        console.log(this.listUser);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }
  

}
