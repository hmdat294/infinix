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
  isDialogVisible = false; // Điều khiển hiển thị bảng
  currentItem: any = null;
  listShop: any[] = [];

  constructor(
    private adminService: AdminService,
    private settingService: SettingService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    
    this.adminService.getShop().subscribe(
      (response) => {
        this.listShop = response.data; // Lưu danh sách cửa hàng
        console.log('List shops:', this.listShop);

        this.filtershops();
      },
      (error) => {
        console.error('Error fetching shops:', error);
      }
    );
  }
  openDialog(): void {
    this.isDialogVisible = !this.isDialogVisible;
  }
  changIsActiveShop(shop_id: number, is_active: string): void {
    this.adminService.postshop(shop_id, is_active).subscribe((response) => {
      console.log(is_active);
      const shop = this.listShop.find((shop: any) => shop.id == shop_id);
      shop.is_active = is_active;
      this.isDialogVisible = false;
    });
  }

 

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

 

  filtershops(): void {
    if (this.filterStatus === 'all') {
      this.filteredshops = [...this.listShop]; // Hiển thị tất cả
    } else {
      const status = parseInt(this.filterStatus, 10); // Chuyển filterStatus thành number
      this.filteredshops = this.listShop.filter(
        (shop) => shop.is_active === status
      );
    }
  }
}
