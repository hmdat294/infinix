import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-user',
    imports: [NavComponent, CommonModule, RouterModule],
    templateUrl: './user.component.html',
    styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  listUser: any;
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
