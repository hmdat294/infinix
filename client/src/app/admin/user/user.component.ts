import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user',
  imports: [NavComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    NgxPaginationModule,],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  listUser: any[] = [];
  filteredUsers: any[] = []; // Kết quả lọc tìm kiếm
  searchTerm: string = '';   // Biến chứa nội dung tìm kiếm
  currentPage = 1;           // Trang hiện tại


  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getUser().subscribe(
      (response) => {
        // Gán dữ liệu vào listUser
        this.listUser = response.data;

        console.log(response.data);
        this.filteredUsers = [...this.listUser];
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }

  // Tìm kiếm hoặc hiển thị lại danh sách gốc
  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.listUser]; // Hiển thị lại toàn bộ khi xóa tìm kiếm
    } else {
      this.filterUsers();
    }
  }

  // Hàm lọc danh sách theo ID hoặc tên
  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();

    // Kiểm tra dữ liệu trước khi lọc
    if (this.listUser && this.listUser.length) {
      this.filteredUsers = this.listUser.filter(user =>

        user.profile.display_name.toLowerCase().includes(term) || user.id.toString().includes(term)
      );
    }
  }

  // Xóa nội dung tìm kiếm
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredUsers = [...this.listUser]; // Hiển thị lại toàn bộ danh sách
  }


}
