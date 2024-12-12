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

@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [NavComponent,CommonModule, FormsModule, RouterModule],
  templateUrl: './shop-dashboard.component.html',
  styleUrl: './shop-dashboard.component.css'
})
export class ShopDashboardComponent implements OnInit{
  tabAccordion: string = '';
  constructor(private adminService: AdminService, 
    private settingService: SettingService,
    private paymentService: PaymentService,
    private el: ElementRef,) { }
  
  ngOnInit(): void {
    this.renderChart();

    

  }
  renderChart(): void {
    // const userTotals = this.User_Growth.map((item: any) => item.cumulative_total);
    // const userDates = this.User_Growth.map((item: any) => item.date);

    // const postTotals = this.Post_Growth.map((item: any) => item.cumulative_total);
    // const postDates = this.Post_Growth.map((item: any) => item.date);

    // const conversationsTotals = this.Conversations_Growth.map((item: any) => item.cumulative_total);
    // const conversationsDates = this.Conversations_Growth.map((item: any) => item.date);
    // console.log('show growth:', userTotals, conversationsTotals, postTotals);
    
    // const longestDates = userDates.length >= postDates.length 
    // ? (userDates.length >= conversationsDates.length ? userDates : conversationsDates) 
    // : (postDates.length >= conversationsDates.length ? postDates : conversationsDates);
    
    const chartOptions: ApexOptions = {
      chart: {
        foreColor: '#9ba7b2',
        height: 460,
        type: 'line',
        zoom: { enabled: false },
        dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
      },
      stroke: { width: 5, curve: 'smooth' },
      colors: ["#5283FF", '#F1C40F', '#FF4C92', "#17a00e"],
      series: [{
        name: "Người dùng",
        data: [14, 100, 35, 25]  // Sử dụng userData từ API
      },
      {
        name: "Bài viết",
        data: [14, 22, 35, 40]  // Sử dụng userData từ API
      },
      {
        name: "Cuộc trò chuyện",
        data: [14, 22, 35, 40] // Sử dụng userData từ API
      }
      ],
      xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000'],
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
