import { Component, ElementRef, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { AdminService } from '../../service/admin.service';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { SettingService } from '../../service/setting.service';
import { PaymentService } from '../../service/payment.service';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-shop-dashboard',
  imports: [NavComponent, CommonModule, FormsModule, RouterModule, NgApexchartsModule, NgxPaginationModule],
  templateUrl: './shop-dashboard.component.html',
  styleUrl: './shop-dashboard.component.css'
})
export class ShopDashboardComponent implements OnInit {
  totalShop: number = 0;
  user: any;
  totalRevenue: string = '';
  listShop: any[] = [];
  listProduct: any[] = [];
  listUser: any[] = [];
  ShopRevenus: any[] = [];
  ShopId: number = 0;
  shop: any;
  products: any;
  Cumulative_Revenue: any[] = [];
  Cumulative_Revenue_Date: any[] = [];
  isDialogVisible = false;
  tabAccordion: string = '';
  chart2: any;

  dates: any = [];
  revenues: any = [];
  originalDates: any = [];
  constructor(private adminService: AdminService,
    private settingService: SettingService,
    private paymentService: PaymentService,
    private el: ElementRef,) { }

  ngOnInit(): void {

    this.adminService.getShop().subscribe(
      (response) => {
        this.listShop = response.data.filter((item: any) => item.is_active === 1);
        this.totalShop = response.data.length;
        console.log('List shops:', this.listShop);
        const idShop = this.listShop.map(item => item.id);
        console.log(idShop);


      },
      (error) => {
        console.error('Error fetching shops:', error);
      }
    );



    this.adminService.getRevenus().subscribe(
      (response) => {
        if (response && response.length > 0) {
          const lastItem = response[response.length - 1];
          this.totalRevenue = this.formatCurrency(lastItem.cumulative_revenue);
          console.log(this.totalRevenue); // Kiểm tra kết quả
        } else {
          console.log('Không có dữ liệu từ API');
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );

    this.adminService.getShopRevenus().subscribe((res) => {
      this.ShopRevenus = res.data
        .sort((a: any, b: any) => {
          if (b.total_revenue !== a.total_revenue) {
            return b.total_revenue - a.total_revenue; // Sắp xếp theo tổng doanh thu (giảm dần)
          }
          return b.total_quantity_sold - a.total_quantity_sold; // Nếu doanh thu bằng nhau, sắp xếp theo số lượng bán (giảm dần)
        })
        .slice(0, 4); // Lấy 4 mục đầu tiên

      console.log("Shop Revenus", this.ShopRevenus);

    }
    ),



      this.adminService.getRevenus().subscribe(
        (response) => {


          response.forEach((item: any) => {
            this.Cumulative_Revenue.push(item.cumulative_revenue); // Lưu trữ dữ liệu từ API
            this.Cumulative_Revenue_Date.push(item.date);


          });
          console.log(this.Cumulative_Revenue);
          console.log(this.Cumulative_Revenue_Date);
          this.chart2 = {
            chart: {
              foreColor: '#9ba7b2',
              height: 460,
              type: 'line',
              zoom: { enabled: false },
              dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
            },
            stroke: { width: 5, curve: 'smooth' },
            colors: ["#5283FF", '#00FF0A'],
            series: [

              {
                name: "Tổng doanh thu",
                data: this.Cumulative_Revenue   // Sử dụng userData từ API
              },
              {
                name: "Tổng lợi nhuận",
                data: [14, 22, 35, 40] // Sử dụng userData từ API
              }
            ],
            xaxis: {
              type: 'datetime',
              categories: this.Cumulative_Revenue_Date,
            },
            title: {
              text: 'Thống kê cửa hàng',
              offsetY: 0,
              offsetX: 20
            },
            markers: {
              size: 5,
              strokeColors: "#fff",
              strokeWidth: 1,
              hover: {
                size: 7
              }
            },
          }
        },
        (error) => {
          console.error('Lỗi khi gọi API:', error);
        }
      );



  }
  currentPage = 1;
  formatCurrency(value: number): string {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      return value.toString();
    }
  }

  onItemClick(id: number): void {
    console.log('Selected Shop ID:', id);
    this.adminService.getListProductByShop(id).subscribe((res) => {
      this.listProduct = res.data.sort((a: any, b: any) => b.total_sold - a.total_sold) // Sắp xếp giảm dần
        .slice(0, 3);
      console.log(this.listProduct);

    });
    // Xử lý logic khác nếu cần
  }


  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }
  openDialog(): void {

    this.isDialogVisible = !this.isDialogVisible;

  }
}
