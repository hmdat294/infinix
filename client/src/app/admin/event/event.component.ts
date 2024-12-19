import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../service/admin.service';
import { SettingService } from '../../service/setting.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-event',
  imports: [
    NavComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    NgxPaginationModule,
  ],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {
  listUser: any[] = [];
  tabAccordion: string = '';
  reportService: any;
  listReport: any[] = [];
  filteredReports: any[] = [];
  filteredshops: any[] = [];
  filterStatus: string = 'all';
  currentPage = 1;
  shopid: number = 0;
  isDialogVisible: number = 0; // Điều khiển hiển thị bảng
  currentItem: any = null;
  listShop: any[] = [];

  constructor(
    private adminService: AdminService,
    private settingService: SettingService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.adminService.getShop().subscribe(
      (response) => {
        this.listShop = response.data; // Lưu danh sách cửa hàng
        console.log('List shops:', this.listShop);
        this.sortByStatus();
        this.filtershops();
      },
      (error) => {
        console.error('Error fetching shops:', error);
      }
    );
  }
  openDialog(id: number): void {
    this.isDialogVisible = id;
  }
  changIsActiveShop(shop_id: number, is_active: string): void {
    this.adminService.postshop(shop_id, is_active).subscribe((response) => {
      console.log(is_active);
      const shop = this.listShop.find((shop: any) => shop.id == shop_id);
      shop.is_active = is_active;
      this.isDialogVisible = 0;
      this.filtershops();
      this.sortByStatus();
      this.cdr.detectChanges()
      
    });
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(
      this.tabAccordion,
      tab,
      this.el
    );
  }

  sortByStatus(): void {
    this.filteredshops.sort((a, b) => {
      if (a.is_active === '0' && b.is_active !== '0') return -1;
      if (a.is_active !== '0' && b.is_active === '0') return 1;
      return 0;
    });
  }
  

  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords
      ? words.slice(0, maxWords).join(' ') + '...'
      : text;
  }

  filtershops(): void {
    if (this.filterStatus === 'all') {
      // Hiển thị tất cả cửa hàng
      this.filteredshops = [...this.listShop];
    } else {
      // Chuyển đổi filterStatus thành số nếu không phải 'all'
      const status = this.filterStatus === '1' ? 1 : 0;
      this.filteredshops = this.listShop.filter(
        (shop) => shop.is_active === status
      );
    }

    console.log(this.filteredshops);
  }
}
