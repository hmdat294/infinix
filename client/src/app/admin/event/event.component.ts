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
    imports: [NavComponent, CommonModule, RouterModule, FormsModule, NgxPaginationModule],
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css']
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
  listShop: any[] = [];

  constructor(
    private adminService: AdminService,
    private settingService: SettingService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchReports();
    this.adminService.getShop().subscribe(
      (response) => {
        this.listShop = response.data; // Lưu danh sách cửa hàng
        console.log('List shops:', this.listShop);
    
        // Duyệt qua mỗi cửa hàng và gọi API lấy thông tin user theo userId
        this.listShop.forEach(shop => {
          const userId = shop.user_id; // Giả sử userId là trường trong mỗi cửa hàng
    
          // Gọi API để lấy thông tin user theo userId
          this.adminService.getUserId(userId).subscribe(
            (userResponse) => {
              shop.user = userResponse.data; // Lưu thông tin user vào mỗi shop
              console.log('User for shop:', shop.user_id);
            },
            (error) => {
              console.error('Error fetching user for shop:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching shops:', error);
      }
    );
  }
  openDialog(): void {
    
    this.isDialogVisible = !this.isDialogVisible;
    
  }
  approve(): void {
    if (this.currentItem) {
      const shopId = this.currentItem.id;
      const isActive = '1'; // Trạng thái "Đã giải quyết"
  
      this.adminService.postshop(shopId, isActive).subscribe(
        (response) => {
          console.log('Cập nhật trạng thái thành công:', response);
  
          // Cập nhật trạng thái trực tiếp trong listShop
          const shopIndex = this.listShop.findIndex(shop => shop.id === shopId);
          if (shopIndex !== -1) {
            this.listShop[shopIndex].is_active = '1';
          }
  
          this.isDialogVisible = false; // Đóng hộp thoại sau khi xử lý xong
        },
        (error) => {
          console.error('Cập nhật trạng thái thất bại:', error);
          alert('Không thể duyệt trạng thái. Vui lòng thử lại.');
        }
      );
    }
  }
  
  reject(): void {
    if (this.currentItem) {
      const shopId = this.currentItem.id;
      const isActive = '0'; // Trạng thái "Chưa giải quyết"
  
      this.adminService.postshop(shopId, isActive).subscribe(
        (response) => {
          console.log('Từ chối trạng thái thành công:', response);
  
          // Cập nhật trạng thái trực tiếp trong listShop
          const shopIndex = this.listShop.findIndex(shop => shop.id === shopId);
          if (shopIndex !== -1) {
            this.listShop[shopIndex].is_active = '0';
          }
  
          this.isDialogVisible = false; // Đóng hộp thoại sau khi xử lý xong
        },
        (error) => {
          console.error('Từ chối trạng thái thất bại:', error);
          alert('Từ chối trạng thái thất bại. Vui lòng thử lại.');
        }
      );
    }
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
    this.adminService.getReports().subscribe(
      (data) => {
        this.listReport = data; // Dữ liệu được lấy từ API
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu:', error);
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
        (report) => report.status === this.filterStatus // Sử dụng `status` để lọc thay vì `is_active`
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
  
        // Gọi lại API để đồng bộ dữ liệu từ server
        this.fetchReports();
      },
      (error) => {
        console.error('Lỗi không cập nhật:', error);
      }
    );
  }
  
  
}
