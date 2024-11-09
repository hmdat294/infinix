import { Component, OnInit } from '@angular/core';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { AdminService } from '../../service/admin.service';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalPosts: number = 0;
  totalReports: number = 0;
  listUser: any;
  Conversations_Growth: any;
  User_Growth: any[] = []; // Khởi tạo mảng rỗng cho User_Growth
  Post_Growth: any[] = []; // Khởi tạo mảng rỗng cho Post_Growth
  totalPost: any;
  totalReport: any;
  
  constructor(private adminService: AdminService) { }


  ngOnInit(): void {
    // this.renderChart();

    // this.renderDonutChart();
    // this.renderRadialBarChart();
    // this.renderLineChart1();
    this.adminService.getConversationsGrowthData().subscribe(data => {
      this.Conversations_Growth = data;  // Lưu trữ dữ liệu từ API
      this.renderLineChart1();
      console.log(this.Conversations_Growth);
      // Vẽ biểu đồ sau khi có dữ liệu
    }, error => {
      console.error('Lỗi khi lấy dữ liệu:', error);
    });

    this.adminService.getTotalUser().subscribe(
      (response) => {
        this.totalUsers = response.total_users;
        console.log(this.totalUsers);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
    this.adminService.getTotalPost().subscribe(
      (response) => {
        this.totalPost = response.total_posts;
        console.log(this.totalPost);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
    this.adminService.getTotalReport().subscribe(
      (response) => {
        this.totalReport = response.data;
        console.log(this.totalReport);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
    this.fetchDataAndRenderChart();
    this.fetchReportDataAndRenderDonutChart();
    this.loadDonutChartData();

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
      series: [{
        name: "User",
        data: userTotals  // Sử dụng userData từ API
      },
      {
        name: "Post",
        data: postTotals  // Sử dụng userData từ API
      },
      {
        name: "Report",
        data: [42, 25, 23, 31]  // Sử dụng userData từ API
      }
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
        hover: {
          size: 7
        }
      },
    };

    const chart = new ApexCharts(document.querySelector('#chart2'), chartOptions);
    chart.render();
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
renderDonutChart(seriesData: number[]): void {
  // Kiểm tra dữ liệu trước khi render biểu đồ
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


fetchReportDataAndRenderDonutChart(): void {
  this.adminService.getReports().subscribe((response: any) => {
    const reportData = Array.isArray(response.data) ? response.data : [];

    const userReports = reportData.filter((item: any) => item.type === 'user').length;
    const postReports = reportData.filter((item: any) => item.type === 'post').length;
    const commentReports = reportData.filter((item: any) => item.type === 'comment').length;
    const messageReports = reportData.filter((item: any) => item.type === 'message').length;
    console.log('Data passed to :',userReports,postReports,commentReports,messageReports);
    
    this.renderRadialBarChart(userReports, postReports, commentReports, messageReports);
  }, error => {
    console.error("Error fetching report data:", error);
  });
}
  renderRadialBarChart(userReports: number, postReports: number, commentReports: number, messageReports: number): void {
    const donutChartOptions: ApexOptions = {
      series: [userReports, postReports, commentReports, messageReports],
      chart: {
        foreColor: '#9ba7b2',
        height: 240,
        type: 'donut',
        dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
      },
      colors: ["#ffc107", "#0d6efd", "#17a00e", "#f41127"],
      title: {
        text: 'Growth Report',
        offsetY: 0,
        offsetX: 0
      },
      labels: ['User report', 'Comment report', 'Post report', 'Group report'],
      legend: {
        position: 'bottom',
        formatter: function (val: string, opts: any) {
          return val;
        }
      },
    };

    const donutChart = new ApexCharts(document.querySelector('#chart13'), donutChartOptions);
    donutChart.render();
  }



  // renderRadialBarChart(): void {
  //   const radialBarOptions: ApexOptions = {
  //     series: [44, 55, 67, 83],
  //     chart: {
  //       height: 350,
  //       type: 'radialBar',
  //       dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
  //     },
  //     plotOptions: {
  //       radialBar: {
  //         dataLabels: {
  //           total: {
  //             show: true,
  //             label: 'Tổng quan',
  //           }
  //         }
  //       }
  //     },
  //     colors: ["#17a00e", "#f41127", "#0d6efd", "#ffc107"],
  //     labels: ['User report', 'Comment report', 'Post report', 'Post report'],
  //     title: {
  //       text: 'Growth statistics',
  //       offsetY: 0,
  //       offsetX: 0
  //     },
  //     legend: {
  //       position: 'bottom',
  //       formatter: function(val: string, opts: any) {
  //         return val;
  //       }
  //     }, 
  //   };

  //   const radialBarChart = new ApexCharts(document.querySelector('#chart13'), radialBarOptions);
  //   radialBarChart.render();
  // }


  renderLineChart1(): void {
    const ConversationsTotals = this.Conversations_Growth.map((item: any) => item.total);
    const ConversationsDates = this.Conversations_Growth.map((item: any) => item.date);
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
        name: 'Conversations',
        data: ConversationsTotals
      }],
      xaxis: {
        type: 'datetime',
        categories: ConversationsDates,
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
