import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import Swal from 'sweetalert2';
import { SettingService } from '../../service/setting.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-report-post',
    imports: [NavComponent, CommonModule,TranslateModule, RouterModule, FormsModule, NgxPaginationModule],
    templateUrl: './report-post.component.html',
    styleUrl: './report-post.component.css'
})
export class ReportpostComponent {
  tabAccordion: string = '';
  reportService: any;
  listReport: any[] = [];
  filteredReports: any[] = []; // Mảng lọc
  filterStatus: string = 'all';
  constructor(private adminService: AdminService,
    private settingService: SettingService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) { }
  


  


  
  ngOnInit(): void {
    this.adminService.getReports().subscribe(
      (response) => {
        // Gán mảng `data` từ response vào `listReport` và thêm thuộc tính `isExpanded`
        this.listReport = response.data
          .filter((item: any) => item.type === 'post')
          .map((item: any) => ({ ...item, isExpanded: false }));
        this.filteredReports = [...this.listReport];
        this.sortReportsByStatus(); 
        console.log(this.listReport);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }
  currentPage =1;
 
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

  // deleteReport(reportId: number): void {
  //   this.adminService.deleteReport(reportId).subscribe(
  //     (response) => {
  //       console.log('Báo cáo đã được xóa:', response);
  //       // Cập nhật danh sách báo cáo sau khi xóa
  //       this.listReport = this.listReport.filter((report: any) => report.id !== reportId);
  //     },
  //     (error) => {
  //       console.error('Lỗi khi xóa báo cáo:', error);
  //     }
  //   );
  // }
  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  }


  updateStatus(item: any): void {
    this.adminService.updateReportStatus(item.id, item.status).subscribe(
      (response) => {
        console.log('Trạng thái đã được cập nhật:', response);
  
        // Loại bỏ báo cáo đã giải quyết
        // if (item.status === 'resolved') {
        //   this.filteredReports = this.filteredReports.filter(
        //     (report) => report.id !== item.id
        //   );
        // }

        this.sortReportsByStatus(); // Sắp xếp lại sau khi trạng thái thay đổi
  
        this.cdr.detectChanges(); // Buộc cập nhật giao diện
      },
      (error) => {
        console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    );
  }

  sortReportsByStatus(): void {
    this.filteredReports.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1; // "Chưa giải quyết" lên trên
      if (a.status !== 'pending' && b.status === 'pending') return 1;  // "Đã giải quyết" xuống dưới
      return 0; // Giữ nguyên thứ tự nếu trạng thái giống nhau
    });
  }

  toggleDetails(index: number, event: Event): void {
    event.preventDefault(); // Ngăn reload trang
    this.listReport[index].isExpanded = !this.listReport[index].isExpanded;
  }
  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

}
