import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SettingService } from '../../service/setting.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';
// import Swal from 'sweetalert2';

@Component({
    selector: 'app-report-comment',
    imports: [NavComponent, CommonModule,TranslateModule, RouterModule, FormsModule, NgxPaginationModule],
    templateUrl: './report-comment.component.html',
    styleUrl: './report-comment.component.css'
})

export class ReportCommentComponent {
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

        this.listReport = response.data
          .filter((item: any) => item.type === 'comment')
          .map((item: any) => ({ ...item, isExpanded: false }));
        this.filteredReports = [...this.listReport];
        this.sortReportsByStatus();
        // console.log(this.listReport);
      },
      (error) => {
        // console.error('Lỗi khi gọi API:', error);
      }
    );
  }
  currentPage = 1;
  filterReports(): void {
    if (this.filterStatus === 'all') {
      this.filteredReports = [...this.listReport];
    } else {
      this.filteredReports = this.listReport.filter(
        (item) => item.status === this.filterStatus
      );
    }
  } tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  }
  sortReportsByStatus(): void {
    this.filteredReports.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1; // "Chưa giải quyết" lên trên
      if (a.status !== 'pending' && b.status === 'pending') return 1;  // "Đã giải quyết" xuống dưới
      return 0; // Giữ nguyên thứ tự nếu trạng thái giống nhau
    });
  }

  updateStatus(item: any): void {
    this.adminService.updateReportStatus(item.id, item.status).subscribe(
      (response) => {

        this.sortReportsByStatus(); // Sắp xếp lại sau khi trạng thái thay đổi

        this.cdr.detectChanges(); // Buộc cập nhật giao diện
      },
      (error) => {
        // console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    );
  }

  toggleDetails(index: number, event: Event): void {
    event.preventDefault(); // Ngăn reload trang
    this.listReport[index].isExpanded = !this.listReport[index].isExpanded;
  }

}