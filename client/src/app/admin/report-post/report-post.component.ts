import { Component, ElementRef } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import Swal from 'sweetalert2';
import { SettingService } from '../../service/setting.service';

@Component({
    selector: 'app-report-post',
    imports: [NavComponent, CommonModule, RouterModule, FormsModule],
    templateUrl: './report-post.component.html',
    styleUrl: './report-post.component.css'
})
export class ReportpostComponent {
  listReport: any;
  tabAccordion: string = '';
  constructor(private adminService: AdminService,
    private settingService: SettingService,
    private el: ElementRef
  ) { }
  

  confirmDelete(reportId: number, event: Event): void {
    event.preventDefault(); // Ngăn chặn reload trang khi nhấn vào link

    // Swal.fire({
    //   title: 'Xác nhận xóa?',
    //   text: 'Bạn có chắc chắn muốn xóa báo cáo này không?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Có',
    //   cancelButtonText: 'Không'
    // }).then((result:any) => {
    //   if (result.isConfirmed) {
    //     this.deleteReport(reportId);
    //   }
    // });
  }
  


  
  ngOnInit(): void {
    this.adminService.getReports().subscribe(
      (response) => {
        // Gán mảng `data` từ response vào `listReport` và thêm thuộc tính `isExpanded`
        this.listReport = response.data
          .filter((item: any) => item.type === 'post')
          .map((item: any) => ({ ...item, isExpanded: false }));
        
        console.log(this.listReport);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }



  deleteReport(reportId: number): void {
    this.adminService.deleteReport(reportId).subscribe(
      (response) => {
        console.log('Báo cáo đã được xóa:', response);
        // Cập nhật danh sách báo cáo sau khi xóa
        this.listReport = this.listReport.filter((report: any) => report.id !== reportId);
      },
      (error) => {
        console.error('Lỗi khi xóa báo cáo:', error);
      }
    );
  }
  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
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

  toggleDetails(index: number, event: Event): void {
    event.preventDefault(); // Ngăn reload trang
    this.listReport[index].isExpanded = !this.listReport[index].isExpanded;
  }
  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

}
