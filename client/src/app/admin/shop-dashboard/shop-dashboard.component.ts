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
export class ShopDashboardComponent implements OnInit{
  totalShop: number = 0;
  listShop: any[] = [];
  listUser: any[] = [];
  Cumulative_Revenue:any[]=[];
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
        const shops=response.data.filter((shop:any)=>shop.is_active==1);
        this.totalShop = shops.length; // Tính tổng số lượng shop
        console.log('Total shops:', this.totalShop);
     
        this.listShop = shops; // Lưu danh sách cửa hàng
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
  currentPage =1;
  fetchDataAndRenderChart(): void {
    this.adminService.getRevenus().subscribe(CumulativeRevenue => {
      this.Cumulative_Revenue = CumulativeRevenue;

      
          // Sau khi có dữ liệu từ cả hai API, gọi hàm để vẽ biểu đồ
          this.renderChart();
        });
     
  }

  renderChart(): void {
    
    const Cumulative_Revenue = this.Cumulative_Revenue.map((item: any) => item.cumulative_revenue);
    const dates = this.Cumulative_Revenue.map((item: any) => item.date);
   

    
    const chartOptions: ApexOptions = {
      chart: {
        foreColor: '#9ba7b2',
        height: 460,
        type: 'line',
        zoom: { enabled: false },
        dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
      },
      stroke: { width: 5, curve: 'smooth' },
      colors: [ '#F1C40F',"#5283FF", '#00FF0A'],
      series: [{
        name: "Cửa hàng",
        data:[14, 2, 5, 4] // Sử dụng userData từ API
      },
      {
        name: "Tổng doanh thu",
        data: Cumulative_Revenue   // Sử dụng userData từ API
      },
      {
        name: "Tổng lợi nhuận",
        data: [14, 22, 35, 40] // Sử dụng userData từ API
      }
      ],
      xaxis: {
        type: 'datetime',
        categories: dates,
      },
      title: {
        text: 'Growth statistics',
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
    };

    const chart = new ApexCharts(document.querySelector('#chart2'), chartOptions);
    chart.render();
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }
}
