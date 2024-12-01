import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [NavComponent, CommonModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})

export class EventComponent implements OnInit {
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
