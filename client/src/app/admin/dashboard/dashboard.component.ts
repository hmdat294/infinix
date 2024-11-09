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
  totalUsers: number = 0;
  totalPosts: number = 0;
  totalReports: number = 0;
  listUser: any;
  User_Growth: any[] = []; // Khởi tạo mảng rỗng cho User_Growth
  Post_Growth: any[] = []; // Khởi tạo mảng rỗng cho Post_Growth

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadTotalUsers();
    this.loadLineChartData();
    this.fetchDataAndRenderChart();
    this.renderRadialBarChart();
    this.loadTotalReports();
    this.loadTotalPosts();
    this.loadDonutChartData(); // Gọi hàm lấy dữ liệu cho Donut Chart
  }

  fetchDataAndRenderChart(): void {
    this.adminService.getUserGrowthData().subscribe(userGrowthData => {
      this.User_Growth = userGrowthData;

      this.adminService.getPostGrowthData().subscribe(postGrowthData => {
        this.Post_Growth = postGrowthData;
        
        // Sau khi có dữ liệu từ cả hai API, gọi hàm để vẽ biểu đồ
        this.renderChart();
      });
    });
  }

  loadTotalUsers(): void {
    this.adminService.getTotalUsers().subscribe(data => {
      this.totalUsers = data.data;
      console.log("Total Users:", this.totalUsers); // Kiểm tra giá trị
    });
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
  
  loadDonutChartData(): void {
    Promise.all([
      this.adminService.getTotalPostBookmarks().toPromise(),
      this.adminService.getTotalPostComments().toPromise(),
      this.adminService.getTotalPostLikes().toPromise(),
      this.adminService.getTotalPostShares().toPromise()
    ]).then((responses) => {
      const series = (responses as Array<{ data: number } | undefined>).map((response) => response ? response.data : 0);
      console.log('Series data for Donut Chart:', series);
      this.renderDonutChart(series);
    }).catch(error => {
      console.error('Lỗi khi gọi API:', error);
    });
}
  renderChart(): void {
    const userTotals = this.User_Growth.map((item: any) => item.total);
    const userDates = this.User_Growth.map((item: any) => item.date);

    const postTotals = this.Post_Growth.map((item: any) => item.total);
    const postDates = this.Post_Growth.map((item: any) => item.date);
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
        { name: "Post", data: postTotals },
        { name: "Content", data: userTotals }
      ],
      xaxis: {
        type: 'datetime',
        categories: userDates.length > postDates.length ? userDates : postDates,
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

  renderDonutChart(seriesData: number[]): void {
    console.log('Data passed to renderDonutChart:', seriesData);

    const donutChartOptions: ApexOptions = {
      series: seriesData,
      chart: {
        foreColor: '#9ba7b2',
        height: 240,
        type: 'donut',
        dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
      },
      colors: ["#ffc107", "#17a00e", "#0d6efd", "#f41127"],
      title: {
        text: 'Total Post',
        offsetY: 0,
        offsetX: 0
      },
      labels: ['Post Bookmarks', 'Post Comments', 'Post Likes', 'Post Shares'],
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
