import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ShopService } from '../../../service/shop.service';
import { AuthService } from '../../../service/auth.service';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { CurrencyVNDPipe } from '../../../currency-vnd.pipe';

@Component({
  selector: 'app-statistic',
  imports: [NgApexchartsModule, CommonModule, FormsModule, CurrencyVNDPipe],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css'
})
export class StatisticComponent implements OnInit {

  user: any;
  shop: any;

  startDate: string = '';
  endDate: string = '';

  dates: any = [];
  revenues: any = [];
  cumulative_revenue: any = [];

  original_dates: any = [];
  original_revenues: any = [];
  original_cumulative_revenue: any = [];

  dates_estimated: any = [];
  revenues_estimated: any = [];
  cumulative_revenue_estimated: any = [];

  original_dates_estimated: any = [];
  original_revenues_estimated: any = [];
  original_cumulative_revenue_estimated: any = [];

  chartOptions_1: any = {};
  chartOptions_2: any = {};
  chartOptions_3: any = {};

  constructor(
    private authService: AuthService,
    private shopService: ShopService,
  ) { }

  order_status: any = {
    'pending': 'Chờ xử lý',
    'received': 'Đã nhận đơn',
    'delivering': 'Đang giao',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy'
  }

  order_color: any = {
    'pending': '#ffb625',
    'received': '#fbff25',
    'delivering': '#34ff25',
    'delivered': '#256aff',
    'cancelled': '#ff2525'
  }

  ngOnInit(): void {


    this.authService.getUser(0).subscribe(
      (res) => {
        this.user = res.data;

        if (this.user.shop_id > 0) {

          this.shopService.getShop(this.user.shop_id).subscribe(
            (res: any) => this.shop = res.data)

          this.shopService.getStatisticShop(this.user.shop_id).subscribe(
            (res_shop) => {

              this.shopService.getStatisticEstimated(this.user.shop_id).subscribe(
                (res_estimated) => {

                  this.revenues = res_shop.map((item: any) => item.revenue);
                  this.cumulative_revenue = res_shop.map((item: any) => item.cumulative_revenue);

                  this.original_revenues = [...this.revenues];
                  this.original_cumulative_revenue = [...this.cumulative_revenue];

                  this.dates_estimated = res_estimated.map((item: any) => item.date);
                  this.revenues_estimated = res_estimated.map((item: any) => item.revenue - (item.revenue * 5 / 100));
                  this.cumulative_revenue_estimated = res_estimated.map((item: any) => item.cumulative_revenue - (item.cumulative_revenue * 5 / 100));

                  this.original_dates_estimated = [...this.dates_estimated];
                  this.original_revenues_estimated = [...this.revenues_estimated];
                  this.original_cumulative_revenue_estimated = [...this.cumulative_revenue_estimated];


                  this.chartOptions_1 = {
                    series: [
                      {
                        name: 'Thu nhập dự kiến',
                        data: this.revenues_estimated
                      },
                      {
                        name: 'Thu nhập',
                        data: this.revenues
                      },
                    ],
                    chart: {
                      foreColor: '#9ba7b2',
                      height: 360,
                      type: 'area',
                      zoom: {
                        enabled: false
                      },
                      toolbar: {
                        show: true
                      },
                    },
                    colors: ['#0d6efd', '#54f737'],
                    title: {
                      text: 'Thống kê thu nhập theo ngày',
                      align: 'left'
                    },
                    dataLabels: {
                      enabled: false
                    },
                    stroke: {
                      curve: 'smooth'
                    },
                    xaxis: {
                      type: 'datetime',
                      categories: this.dates_estimated,
                      labels: {
                        formatter: (value: any) => moment(value).format('DD/MM')
                      }
                    },
                  };



                  this.chartOptions_2 = {
                    series: [
                      {
                        name: 'Thu nhập tăng trưởng dự kiến',
                        data: this.cumulative_revenue_estimated
                      },
                      {
                        name: 'Thu nhập tăng trưởng',
                        data: this.cumulative_revenue
                      },
                    ],
                    chart: {
                      foreColor: '#9ba7b2',
                      height: 360,
                      type: 'area',
                      zoom: {
                        enabled: false
                      },
                      toolbar: {
                        show: true
                      },
                    },
                    colors: ['#e4f737', '#f78a37'],
                    title: {
                      text: 'Thống kê thu nhập tăng trưởng theo ngày',
                      align: 'left'
                    },
                    dataLabels: {
                      enabled: false
                    },
                    stroke: {
                      curve: 'smooth'
                    },
                    xaxis: {
                      type: 'datetime',
                      categories: this.dates_estimated,
                      labels: {
                        formatter: (value: any) => moment(value).format('DD/MM')
                      }
                    },
                  };
                });
            });

          this.shopService.getStatisticOrder(this.user.shop_id).subscribe(
            (response) => {
              console.log(response);

              const totalArray = response.data.map((item: any) => item.total);
              const statusArray = response.data.map((item: any) => this.order_status[item.status]);
              const colorArray = response.data.map((item: any) => this.order_color[item.status]);

              this.chartOptions_3 = {
                series: totalArray,
                chart: {
                  foreColor: '#9ba7b2',
                  type: 'donut',
                },
                colors: colorArray,
                title: {
                  text: 'Đơn hàng',
                  align: 'left'
                },
                dataLabels: {
                  enabled: false
                },
                labels: statusArray,
                legend: {
                  show: true,
                  position: 'bottom',
                  horizontalAlign: 'left',
                },
              };

            }
          )
        }
      });

  }
  filterCharts() {

    if (this.startDate && this.endDate) {

      const start = moment(this.startDate);
      const end = moment(this.endDate);

      const filteredDates = this.dates_estimated.filter((date: any, index: number) => {
        const currentDate = moment(date);
        return currentDate.isBetween(start, end, 'day', '[]');
      });

      const filteredEstimated = this.revenues_estimated.filter((_: any, index: number) => {
        const currentDate = moment(this.dates_estimated[index]);
        return currentDate.isBetween(start, end, 'day', '[]');
      });

      const filteredRevenues = this.revenues.filter((_: any, index: number) => {
        const currentDate = moment(this.dates_estimated[index]);
        return currentDate.isBetween(start, end, 'day', '[]');
      });

      const filteredCumulativeEstimated = this.cumulative_revenue_estimated.filter((_: any, index: number) => {
        const currentDate = moment(this.dates_estimated[index]);
        return currentDate.isBetween(start, end, 'day', '[]');
      });

      const filteredCumulativeRevenues = this.cumulative_revenue.filter((_: any, index: number) => {
        const currentDate = moment(this.dates_estimated[index]);
        return currentDate.isBetween(start, end, 'day', '[]');
      });

      this.chartOptions_1.series = [
        {
          name: 'Thu nhập dự kiến',
          data: filteredEstimated
        },
        {
          name: 'Thu nhập',
          data: filteredRevenues
        }
      ];
      this.chartOptions_1.xaxis = {
        ...this.chartOptions_1.xaxis,
        categories: filteredDates
      };

      this.chartOptions_2.series = [
        {
          name: 'Thu nhập tăng trưởng dự kiến',
          data: filteredCumulativeEstimated
        },
        {
          name: 'Thu nhập tăng trưởng',
          data: filteredCumulativeRevenues
        }
      ];
      this.chartOptions_2.xaxis = {
        ...this.chartOptions_2.xaxis,
        categories: filteredDates
      };

    } else {
      this.chartOptions_1.series = [
        {
          name: 'Thu nhập dự kiến',
          data: this.original_revenues_estimated
        },
        {
          name: 'Thu nhập',
          data: this.original_revenues
        }
      ];
      this.chartOptions_1.xaxis = {
        ...this.chartOptions_1.xaxis,
        categories: this.original_dates_estimated
      };

      this.chartOptions_2.series = [
        {
          name: 'Thu nhập tăng trưởng dự kiến',
          data: this.original_cumulative_revenue_estimated
        },
        {
          name: 'Thu nhập tăng trưởng',
          data: this.original_cumulative_revenue
        }
      ];
      this.chartOptions_2.xaxis = {
        ...this.chartOptions_2.xaxis,
        categories: this.original_dates_estimated
      };
    }
  }

}
