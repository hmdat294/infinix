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

@Component({
  selector: 'app-shop-dashboard',
  imports: [NavComponent, CommonModule, FormsModule, RouterModule, NgxPaginationModule],
  templateUrl: './shop-dashboard.component.html',
  styleUrl: './shop-dashboard.component.css'
})
export class ShopDashboardComponent implements OnInit {
  totalShop: number = 0;
  totalRevenue: string = '';
  listShop: any[] = [];
  listUser: any[] = [];
  Cumulative_Revenue: any[]=[];
  Cumulative_Revenue_Date: any[]=[];
  isDialogVisible = false;
  tabAccordion: string = '';
  constructor(private adminService: AdminService,
    private settingService: SettingService,
    private paymentService: PaymentService,
    private el: ElementRef,) { }

  ngOnInit(): void {
    this.renderChart();
    this.adminService.getShop().subscribe(
      (response) => {
        console.log(response);
        const shops = response.data.filter((shop: any) => shop.is_active == 1);
        this.totalShop = shops.length; // Tính tổng số lượng shop
        console.log('Total shops:', this.totalShop);
    
        this.listShop = shops; // Lưu danh sách cửa hàng
        console.log('List shops:', this.listShop);
    
        // Lặp qua mỗi shop và gọi API để lấy doanh thu
        this.listShop.forEach((shop) => {
          const ShopId = shop.id; // ID của shop
        
          // Gọi API lấy doanh thu theo ShopId
          this.adminService.getShopRevenus(ShopId).subscribe(
            (response) => {
              console.log(response);
              shop.revenue = response.data.c
              console.log(shop.revenue);
              
              
            },
            (error) => {
              console.error(`Error fetching revenue for shop ${ShopId}:`, error);
            }
          );
        });
        
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
    
    
    
    this.adminService.getRevenus().subscribe(
      (response) => {
       
        
        response.forEach((item: any) => {
          this.Cumulative_Revenue.push(item.cumulative_revenue); // Lưu trữ dữ liệu từ API
          this.Cumulative_Revenue_Date.push(item.date);
          

        });
        console.log(this.Cumulative_Revenue);
        console.log(this.Cumulative_Revenue_Date);
        
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
  
  renderChart(): void {

    // const Cumulative_Revenue = this.Cumulative_Revenue.map((item: any) => item.cumulative_revenue);
    // const dates = this.Cumulative_Revenue.map((item: any) => item.date);



    // const chartOptions: ApexOptions = {
    //   chart: {
    //     foreColor: '#9ba7b2',
    //     height: 460,
    //     type: 'line',
    //     zoom: { enabled: false },
    //     dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
    //   },
    //   stroke: { width: 5, curve: 'smooth' },
    //   colors: ['#F1C40F', "#5283FF", '#00FF0A'],
    //   series: [{
    //     name: "Cửa hàng",
    //     data: [14, 2, 5, 4] // Sử dụng userData từ API
    //   },
    //   {
    //     name: "Tổng doanh thu",
    //     data: Cumulative_Revenue   // Sử dụng userData từ API
    //   },
    //   {
    //     name: "Tổng lợi nhuận",
    //     data: [14, 22, 35, 40] // Sử dụng userData từ API
    //   }
    //   ],
    //   xaxis: {
    //     type: 'datetime',
    //     categories: dates,
    //   },
    //   title: {
    //     text: 'Growth statistics',
    //     offsetY: 0,
    //     offsetX: 20
    //   },
    //   markers: {
    //     size: 5,
    //     strokeColors: "#fff",
    //     strokeWidth: 1,
    //     hover: {
    //       size: 7
    //     }
    //   },
    // };

    // const chart = new ApexCharts(document.querySelector('#chart2'), chartOptions);
    // chart.render();
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }
  openDialog(): void {

    this.isDialogVisible = !this.isDialogVisible;

  }
}
