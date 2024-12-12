import { Component, ElementRef, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../service/admin.service';
import { SettingService } from '../../service/setting.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [NavComponent, CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {
  listUser: any[] = [];
  tabAccordion: string = '';
  reportService: any;
  listReport: any[] = [];
  filteredReports: any[] = []; 
  filterStatus: string = 'all'; 
  currentPage = 1;
  shopid: number = 0;
  isDialogVisible = false; // Điều khiển hiển thị bảng
  currentItem: any = null;

  constructor(
    private adminService: AdminService,
    private settingService: SettingService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchReports();
  }
  openDialog(item: any): void {
    this.currentItem = item;
    this.isDialogVisible = true;
  }
  approve(): void {
    if (this.currentItem) {
      const shopId = this.currentItem.id;
      const isActive = '1'; // Duyệt => is_active = '1'
  
      // Gọi API để cập nhật trạng thái
      this.adminService.postshop(shopId, isActive).subscribe(
        (response) => {
          console.log('Cập nhật trạng thái thành công:', response);
  
          // Cập nhật trạng thái của item tại frontend
          this.currentItem.is_active = 'resolved';
  
          this.fetchReports(); // Làm mới danh sách báo cáo (nếu cần)
        },
        (error) => {
          console.error('Cập nhật trạng thái thất bại:', error);
        }
      );
    }
    this.closeDialog(); // Đóng hộp thoại
  }
  
  reject(): void {
    if (this.currentItem) {
      const shopId = this.currentItem.id;
      const isActive = '0'; // Từ chối => is_active = '0'
  
      // Gọi API để cập nhật trạng thái
      this.adminService.postshop(shopId, isActive).subscribe(
        (response) => {
          console.log('Từ chối trạng thái thành công:', response);
  
          // Cập nhật trạng thái của item tại frontend
          this.currentItem.is_active = 'pending';
  
          this.fetchReports(); // Làm mới danh sách báo cáo (nếu cần)
        },
        (error) => {
          console.error('Từ chối trạng thái thất bại:', error);
        }
      );
    }
    this.closeDialog(); // Đóng hộp thoại
  }
  
  
  
  closeDialog(): void {
    this.isDialogVisible = false;
    this.currentItem = null;
  }
  fetchUsers(): void {
    this.adminService.getUser().subscribe(
      (response) => {
        if (response?.data) {
          this.listUser = response.data;
          console.log('Users fetched:', this.listUser);
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  fetchReports(): void {
    // Giả định có một API trả về danh sách report
    this.adminService.getReports().subscribe(
      (response) => {
        if (response?.data) {
          this.listReport = response.data;
          this.filteredReports = [...this.listReport];
        }
      },
      (error) => {
        console.error('Error fetching reports:', error);
      }
    );
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  }

  toggleDetails(index: number, event: Event): void {
    event.preventDefault();
    if (this.filteredReports[index]) {
      this.filteredReports[index].isExpanded = !this.filteredReports[index].isExpanded;
    }
  }

  updateStatus(item: any): void {
    this.adminService.postshop(item.id, item.is_active).subscribe(
      (response) => {
        if (response?.postshop) {
          item.is_active = response.postshop;
          this.filterReports();
        }
      },
      (error) => {
        console.error('Lỗi trạng thái:', error);
      }
    );
  }

  filterReports(): void {
    if (this.filterStatus === 'all') {
      this.filteredReports = [...this.listReport];
    } else {
      this.filteredReports = this.listReport.filter(
        (report) => report.status === this.filterStatus
      );
    }
  }

  setshowdebiet(id: number): void {
    this.shopid = id;
  }
  approveShop(shopId: number, isActive: boolean): void {
    const is_active = isActive ? '1' : '0';
    this.adminService.postshop(shopId, is_active).subscribe(
      (response) => {
        console.log(`Shop ${isActive ? 'Đã giải quyết' : 'Không giải quyết'}:`, response);
        // Cập nhật danh sách shop sau khi duyệt
        this.fetchReports(); 
      },
      (error) => {
        console.error('Lỗi không cập nhật:', error);
      }
    );
  }
  
  
}
