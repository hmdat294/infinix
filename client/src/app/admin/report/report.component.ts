import { Component } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [NavComponent,CommonModule,RouterModule],
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
  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  }
}
