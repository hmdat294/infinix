import { Component, OnInit } from '@angular/core';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { AdminService } from '../../service/admin.service';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
 
  totalPosts: number = 0;
  totalReports: number = 0;
  listUser: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadLineChartData();
    this.renderChart();
    this.renderDonutChart();
    this.renderRadialBarChart();
    this.loadTotalReports();
    this.loadTotalPosts();
  }

  loadTotalReports(): void {
    this.adminService.getTotalReports().subscribe(data => {
      this.totalReports = data.data; // Giả sử API trả về trường `data` chứa tổng số báo cáo
    });
  }

  loadTotalPosts(): void {
    this.adminService.getTotalPosts().subscribe(
      data => {
        console.log("Dữ liệu API trả về:", data);
        this.totalPosts = data.data; // Giả sử API trả về dữ liệu trong trường `data`
      },
      error => {
        console.error("Error fetching total posts:", error);
      }
    );
  }

  loadLineChartData(): void {
    this.adminService.getConversationsGrowth().subscribe(
      data => {
        console.log("Dữ liệu từ API:", data); // Kiểm tra dữ liệu từ API
        if (data && Array.isArray(data)) {
          const categories = data.map((item: any) => item.date); // Trích xuất ngày
          const values = data.map((item: any) => item.total); // Trích xuất trường `total`
  
          // Kiểm tra xem `categories` và `values` có đúng không
          console.log("Categories:", categories);
          console.log("Values:", values);
  
          // Gọi hàm render với dữ liệu từ API
          this.renderLineChart1(categories, values);
        } else {
          console.error('Dữ liệu trả về không hợp lệ:', data);
        }
      },
      error => {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      }
    );
  }
  
  
  

  renderChart(): void {
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
      series: [
        { name: "Post", data: [14, 100, 35, 25] },
        { name: "Content", data: [14, 22, 35, 40] },
        { name: "Report", data: [42, 25, 23, 31] }
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
        hover: { size: 7 }
      },
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
      title: {
        text: 'Growth statistics',
        offsetY: 0,
        offsetX: 0
      },
      labels: ['User report', 'Comment report', 'Post report', 'Group report'],
      legend: {
        position: 'bottom',
        formatter: (val: string) => val,
      },
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
      labels: ['User report', 'Comment report', 'Post report', 'Post report'],
      title: {
        text: 'Growth statistics',
        offsetY: 0,
        offsetX: 0
      },
      legend: {
        position: 'bottom',
        formatter: (val: string) => val,
      },
    };

    const radialBarChart = new ApexCharts(document.querySelector('#chart13'), radialBarOptions);
    radialBarChart.render();
  }

  renderLineChart1(categories: string[], values: number[]): void {
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
        name: 'Conversations Growth',
        data: values
      }],
      xaxis: {
        type: 'datetime',
        categories: categories,
      },
      title: {
        text: 'Conversations Growth Over Time'
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
