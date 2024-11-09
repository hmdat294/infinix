import { Component } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [NavComponent,CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {
  listReport: any;
  constructor(private adminService: AdminService) { }
  ngOnInit(): void {
    this.adminService.getReports().subscribe(
      (response) => {
        // Gán mảng `data` từ response vào `listUser`
        this.listReport = response.data.filter((item: any) => item.type === 'user');
        
        console.log(this.listReport);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }
}
