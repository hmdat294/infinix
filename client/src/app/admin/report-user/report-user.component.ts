import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { SettingService } from '../../service/setting.service';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import moment from 'moment';

@Component({
  selector: 'app-report-user',
  imports: [
    NavComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    NgxPaginationModule,
  ],
  templateUrl: './report-user.component.html',
  styleUrl: './report-user.component.css',
})
export class ReportUserComponent {
  tabAccordion: string = '';
  reportService: any;
  listReport: any[] = [];
  filteredReports: any[] = [];
  isDialogVisible = false;
  filterStatus: string = 'all';
  constructor(
    private adminService: AdminService,
    private settingService: SettingService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.adminService.getReports().subscribe(
      (response) => {
        this.listReport = response.data.filter(
          (item: any) => item.type === 'user'
        );
        this.filteredReports = [...this.listReport];
        this.sortReportsByStatus();
        console.log(this.listReport);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
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

  // changeIsActiveShop(reportId: number, status: string): void {
  //   const report = this.listReport.find((item) => item.id === reportId);

  //   if (!report) {
  //     console.error(`Không tìm thấy báo cáo với ID: ${reportId}`);
  //     return;
  //   }

  //   const data = {
  //     hour: new Date().getHours(),
  //     user_id: report.user_id,
  //     permissions: ['can_create_content'],

  //   };

  //   console.log('ID:', report.user_id, 'Status:', status);
  //   this.adminService.updateReportStatus( report.user_id, status ).subscribe(
  //     (response) => {
  //       console.log('Trạng thái đã được cập nhật:', response);
  //     }
  //   );

  //   // console.log('Dữ liệu gửi khi Duyệt:', data);

  //   this.adminService.createOrUpdatePunishment(data).subscribe(
  //     (response) => {
  //       console.log('Phản hồi API:', response);
  //       report.status = status; // Cập nhật trạng thái báo cáo

  //       this.filterReports(); // Lọc lại danh sách để áp dụng thay đổi
  //       this.isDialogVisible = false; // Đóng dialog
  //       this.cdr.detectChanges(); // Cập nhật giao diện
  //     },
  //     (error) => {
  //       console.error('Lỗi khi gọi API:', error);
  //     }
  //   );
  // }

  selectedPermissions: string[] = []; // Mảng lưu các giá trị đã chọn

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      // Nếu được check, thêm giá trị vào mảng
      this.selectedPermissions.push(value);
    } else {
      // Nếu bỏ check, xóa giá trị khỏi mảng
      this.selectedPermissions = this.selectedPermissions.filter(
        (permission) => permission !== value
      );
    }

  }

  date_punishment: string = '';

  reportPunishment(report_id:number, user_id: number, report_status: string) {
    const targetDate = new Date(this.date_punishment);
    const currentDate = new Date();

    const diffTime = targetDate.getTime() - currentDate.getTime();
    const diffHours = diffTime / (1000 * 3600);
    const roundedHours = Math.round(diffHours);

    const data = {
      hour: roundedHours, // Tính số giờ
      user_id: user_id,
      permissions: this.selectedPermissions, // Mảng permissions
    };
    
    this.adminService.createOrUpdatePunishment(data).subscribe((response) => {
      console.log(response);

      this.adminService.updateReportStatus(report_id, report_status).subscribe(
        (response) => {
          console.log('Trạng thái đã được cập nhật:', response);
        })
    });
  }

  onBanDurationChange(event: Event, reportId: number): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      const banDuration = +checkbox.value; // Chuyển value sang số

      // Tìm báo cáo từ danh sách
      const report = this.listReport.find((item) => item.id === reportId);
      if (!report) {
        console.error(`Không tìm thấy báo cáo với ID: ${reportId}`);
        return;
      }

      // Dữ liệu gửi lên server
      const data = {
        hour: new Date().getHours(),
        user_id: report.user_id,
        permissions: ['can_create_content'],
        ban_duration: banDuration,
      };

      console.log('Dữ liệu gửi:', data);

      // Gửi yêu cầu API
      this.adminService.createOrUpdatePunishment(data).subscribe(
        (response) => {
          console.log('Phản hồi API:', response);
          report.status = 'banned'; // Cập nhật trạng thái báo cáo
          this.cdr.detectChanges(); // Cập nhật giao diện
        },
        (error) => {
          console.error('Lỗi API:', error);
        }
      );
    }
  }
  changeStatus(item: any): void {
    const updatedStatus = item.status;

    // Gửi yêu cầu API để cập nhật trạng thái
    this.adminService.updateReportStatus(item.id, updatedStatus).subscribe(
      (response) => {
        console.log('Trạng thái đã được cập nhật:', response);

        // Cập nhật trạng thái trên giao diện
        const report = this.listReport.find((report) => report.id === item.id);
        if (report) {
          report.status = updatedStatus;
          this.sortReportsByStatus(); // Cập nhật thứ tự nếu cần
        }
      },
      (error) => {
        console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    );
  }

  openDialog(): void {
    this.isDialogVisible = !this.isDialogVisible;
  }
  currentPage = 1;
  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(
      this.tabAccordion,
      tab,
      this.el
    );
  }
  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords
      ? words.slice(0, maxWords).join(' ') + '...'
      : text;
  }

  deleteReport(reportId: number): void {
    this.adminService.deleteReport(reportId).subscribe(
      (response) => {
        console.log('Báo cáo đã được xóa:', response);
        // Cập nhật danh sách báo cáo sau khi xóa
        this.listReport = this.listReport.filter(
          (report: any) => report.id !== reportId
        );
      },
      (error) => {
        console.error('Lỗi khi xóa báo cáo:', error);
      }
    );
  }
  updateStatus(item: any): void {
    this.adminService.updateReportStatus(item.id, item.status).subscribe(
      (response) => {
        console.log('Trạng thái đã được cập nhật:', response);
      },
      (error) => {
        console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    );
  }
  sortReportsByStatus(): void {
    this.filteredReports.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1; // "Chưa giải quyết" lên trên
      if (a.status !== 'pending' && b.status === 'pending') return 1; // "Đã giải quyết" xuống dưới
      return 0; // Giữ nguyên thứ tự nếu trạng thái giống nhau
    });
  }
  toggleDetails(index: number, event: Event): void {
    event.preventDefault(); // Ngăn reload trang
    this.listReport[index].isExpanded = !this.listReport[index].isExpanded;
  }
}
