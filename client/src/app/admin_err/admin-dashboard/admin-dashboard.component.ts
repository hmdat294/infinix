import { Component, OnInit } from '@angular/core';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { AdminService } from '../../admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
 
  listUser:any;
  constructor(private adminService: AdminService) { }
 

  ngOnInit(): void {
    this.renderDonutChart();
    this.renderRadialBarChart();
    this.renderLineChart1();
  
    this.adminService.getUser().subscribe(
      (response) => {
        this.listUser = response.data;  // Gán dữ liệu API vào listUser
        console.log(this.listUser);  // In ra console để kiểm tra cấu trúc
    
        // Sử dụng độ dài của mảng để lấy tổng số người dùng
        const userData = [this.listUser.length];  // Dùng .length để lấy số lượng người dùng
        console.log(userData);  // In ra console để kiểm tra dữ liệu
        this.renderChart(userData);  // Vẽ biểu đồ với dữ liệu
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }
  
  renderChart(userData: number[]): void {
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
        name: "Users",
        data: userData  // Sử dụng userData từ API
      },{
        name: "Post",
        data: [14,100,35,25]  // Sử dụng userData từ API
      },
      {
        name: "Content",
        data: [14,22,35,40]  // Sử dụng userData từ API
      },
      {
        name: "Report",
        data: [42,25,23,31]  // Sử dụng userData từ API
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
      yaxis: {
        title: {
          text: 'Engagement',
        },
      }
    };
  
    const chart = new ApexCharts(document.querySelector('#chart2'), chartOptions);
    chart.render();
  }
  
  renderDonutChart(): void {
    const donutChartOptions: ApexOptions = {
      series: [25, 25, 25, 25],
      chart: {
        foreColor: '#9ba7b2',
        height: 240,
        type: 'donut',
        dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
      },
      colors: ["#ffc107", "#0d6efd", "#17a00e", "#f41127"],
      labels: ['User report', 'Comment report', 'Post report', 'Group report']
    };

    const donutChart = new ApexCharts(document.querySelector('#chart9'), donutChartOptions);
    donutChart.render();
  }



  renderRadialBarChart(): void {
    const radialBarOptions: ApexOptions = {
      series: [44, 55, 67, 83],
      chart: {
        height: 350,
        type: 'radialBar',
        dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            total: {
              show: true,
              label: 'Tổng quan',
            }
          }
        }
      },
      colors: ["#17a00e", "#f41127", "#0d6efd", "#ffc107"],
      labels: ['User report', 'Comment report', 'Post report', 'Post report']
    };

    const radialBarChart = new ApexCharts(document.querySelector('#chart13'), radialBarOptions);
    radialBarChart.render();
  }


  renderLineChart1(): void {
    const lineChart1Options: ApexOptions = {
      chart: {
        height: 460,
        type: 'line',
        zoom: { enabled: false },
        dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
      },
      stroke: { width: 5, curve: 'smooth' },
      colors: ["#f41127"],
      series: [{
        name: 'Likes',
        data: [14, 3, 20, 9, 29]
      }],
      xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000'],
      },
      title: {
        text: 'Line Chart'
      },
      markers: {
        size: 5,
        colors: ["#f41127"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      yaxis: {
        title: {
          text: 'Engagement',
        },
      }
    };

    const lineChart1 = new ApexCharts(document.querySelector('#chart1'), lineChart1Options);
    lineChart1.render();
  }
}
