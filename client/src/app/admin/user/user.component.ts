import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { AdminService } from '../../admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NavComponent, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  listUser: any;
  constructor(private adminService: AdminService) { }
  ngOnInit(): void {
    this.adminService.getUser().subscribe(
      (response) => {
        this.listUser = response.data;
        console.log(this.listUser);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }
}
