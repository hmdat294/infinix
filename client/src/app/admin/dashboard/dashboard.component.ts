import { Component, OnInit } from '@angular/core';
// import ApexCharts, { ApexOptions } from 'apexcharts';
import { AdminService } from '../../service/admin.service';
import { NavComponent } from '../nav/nav.component';
import { TranslateModule } from '@ngx-translate/core';
import { ApexOptions } from 'apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import moment from 'moment';

@Component({
  selector: 'app-dashboard',
  imports: [NavComponent, TranslateModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalPosts: number = 0;
  totalReports: number = 0;
  totalConversations: number = 0;
  chart2: any;
  chart13: any;
  chart9: any;

  listUser: any;
  Conversations_Growth: any[] = [];;
  Conversations_Growth_Date: any[] = [];;
  User_Growth_Date: any[] = [];
  User_Growth: any[] = []; // Khởi tạo mảng rỗng cho User_Growth
  Post_Growth: any[] = []; // Khởi tạo mảng rỗng cho Post_Growth
  Post_Growth_Date: any[] = []; // Khởi tạo mảng rỗng cho Post_Growth
  totalPost: any;
  totalReport: any;

  constructor(private adminService: AdminService) { }


  ngOnInit(): void {
    


    // this.renderRadialBarChart();
    // this.renderLineChart1();
    // this.adminService.getConversationsGrowthData().subscribe(data => {
    //   this.Conversations_Growth = data;  // Lưu trữ dữ liệu từ API
    //   this.renderLineChart1();
    //   console.log(this.Conversations_Growth);
    //   // Vẽ biểu đồ sau khi có dữ liệu
    // }, error => {
    //   console.error('Lỗi khi lấy dữ liệu:', error);
    // });
    this.adminService.getUserGrowthData().subscribe(
      (response) => {
        console.log(response);
        response.forEach((user: any) => {
          this.User_Growth.push(user.cumulative_total); // Lưu trữ dữ liệu từ API
          this.User_Growth_Date.push(user.date);

        });
        this.adminService.getPostGrowthData().subscribe(postGrowthData => {

          postGrowthData.forEach((item: any) => {
            this.Post_Growth.push(item.cumulative_total); // Lưu trữ dữ liệu từ API
            this.Post_Growth_Date.push(item.date);


          });
          this.adminService.getConversationsGrowthData().subscribe(data => {
            data.forEach((user: any) => {
              this.Conversations_Growth.push(user.cumulative_total); // Lưu trữ dữ liệu từ API
              this.Conversations_Growth_Date.push(user.date);


            });
          });

        });
        const longestDates = this.User_Growth_Date.length >= this.Post_Growth_Date.length
          ? (this.User_Growth_Date.length >= this.Conversations_Growth_Date.length ? this.User_Growth_Date : this.Conversations_Growth_Date)
          : (this.User_Growth_Date.length >= this.Conversations_Growth_Date.length ? this.Post_Growth_Date : this.Conversations_Growth_Date);

        // Lưu trữ dữ liệu từ API
        console.log(this.User_Growth_Date);
        console.log(this.User_Growth);
        console.log(this.Post_Growth);
        console.log(this.Post_Growth_Date);
        console.log(this.Conversations_Growth);
        console.log(this.Conversations_Growth_Date);

        this.chart2 = {
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
            data: this.User_Growth  // Sử dụng userData từ API
          },
          {
            name: "Bài viết",
            data: this.Post_Growth // Sử dụng userData từ API
          },
          {
            name: "Cuộc trò chuyện",
            data: this.Conversations_Growth // Sử dụng userData từ API
          }
          ],
          xaxis: {
            type: 'datetime',
            categories: longestDates,
          },
          title: {
            text: 'Thống kê',
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

      }

    );
   
    
    this.adminService.getReports().subscribe((response: any) => {
      const reportData = Array.isArray(response.data) ? response.data : [];

      const userReports = reportData.filter((item: any) => item.type === 'user').length;
      const postReports = reportData.filter((item: any) => item.type === 'post').length;
      const commentReports = reportData.filter((item: any) => item.type === 'comment').length;
      const messageReports = reportData.filter((item: any) => item.type === 'message').length;
      console.log('Data passed to :', userReports, postReports, commentReports, messageReports);

      
      this.chart13 = {
        series: [userReports, postReports, commentReports, messageReports],
      chart: {
        foreColor: '#9ba7b2',
        height: 240,
        type: 'donut',
        dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
      },
      colors: ["#ffc107", "#0d6efd", "#17a00e", "#f41127"],
      title: {
        text: 'Trạng thái báo cáo',
        offsetY: 0,
        offsetX: 0
      },
      labels: ['Báo cáo Người dùng', 'Báo cáo bình luận', 'Báo cáo bài viết', 'Báo cáo nhóm'],
      legend: {
        position: 'bottom',
        formatter: function (val: string, opts: any) {
          return val;
        }
      },
      }
    });

    this.adminService.getShop().subscribe((response: any) => {
      const ShopData = Array.isArray(response.data) ? response.data : [];
      const ShopApproved = ShopData.filter((item: any) => item.is_active === 1).length;
      const ShopDApproved = ShopData.filter((item: any) => item.is_active === 0).length;
      
      console.log('Data passed to :', ShopApproved,ShopDApproved);

      
      this.chart9 = {
        series: [ShopApproved, ShopDApproved],
      chart: {
        foreColor: '#9ba7b2',
        height: 240,
        type: 'donut',
        dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
      },
      colors: ["#17a00e",  "#f41127"],
      title: {
        text: 'Trạng thái  cửa hàng',
        offsetY: 0,
        offsetX: 0
      },
      labels: ['Cửa Hàng Đã Duyệt', 'Cừa Hàng Chờ Duyệt'],
      legend: {
        position: 'bottom',
        formatter: function (val: string, opts: any) {
          return val;
        }
      },
      }
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
    this.adminService.getTotalConversations().subscribe(
      (response) => {
        this.totalConversations = response.data;
        console.log(this.totalConversations);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );




  }



 



}
