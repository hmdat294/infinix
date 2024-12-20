import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SettingService } from '../../service/setting.service';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
    selector: 'app-report',
    imports: [NavComponent, CommonModule, RouterModule, FormsModule, NgxPaginationModule],
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css'] // Sửa thành `styleUrls`
})
export class ReportComponent {
  tabAccordion: string = '';
  reportService: any;
  listReport: any[] = [];
  filteredReports: any[] = []; // Mảng lọc
  filterStatus: string = 'all'; // Trạng thái lọc mặc định

  constructor(
    private adminService: AdminService,
    private settingService: SettingService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.adminService.getReports().subscribe(
      (response) => {
        this.listReport = response.data;
        this.filteredReports = [...this.listReport]; // Khởi tạo danh sách lọc
        this.sortReportsByStatus();
        console.log(this.listReport);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }
  currentPage =1;
  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  }

  toggleDetails(index: number, event: Event): void {
    event.preventDefault(); // Ngăn reload trang
    this.filteredReports[index].isExpanded = !this.filteredReports[index].isExpanded;
  }
  updateStatus(item: any): void {
    this.adminService.updateReportStatus(item.id, item.status).subscribe(
      (response) => {
        
  

        this.sortReportsByStatus(); // Sắp xếp lại sau khi trạng thái thay đổi
  
        this.cdr.detectChanges(); // Buộc cập nhật giao diện
      },
      
    );
  }

  sortReportsByStatus(): void {
    this.filteredReports.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1; // "Chưa giải quyết" lên trên
      if (a.status !== 'pending' && b.status === 'pending') return 1;  // "Đã giải quyết" xuống dưới
      return 0; // Giữ nguyên thứ tự nếu trạng thái giống nhau
    });
  }
  
  
  filterReports(): void {
    
    if (this.filterStatus === 'all') {
      this.filteredReports = [...this.listReport];
    } else {
      this.filteredReports = this.listReport.filter(
        (item) => item.status === this.filterStatus
      );
    }
    this.sortReportsByStatus();
  }
}
