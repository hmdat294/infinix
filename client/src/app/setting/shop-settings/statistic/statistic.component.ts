import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ShopService } from '../../../service/shop.service';
import { AuthService } from '../../../service/auth.service';
import moment from 'moment';

@Component({
  selector: 'app-statistic',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css'
})
export class StatisticComponent implements OnInit {

  user: any;

  dates: any = [];
  revenues: any = [];
  originalDates: any = [];

  chartOptions_1: any = {};
  chartOptions_2: any = {};

  constructor(
    private authService: AuthService,
    private shopService: ShopService,
  ) { }

  ngOnInit(): void {


    this.authService.getUser(0).subscribe(
      (res) => {
        this.user = res.data;

        if (this.user.shop_id > 0) {

          this.shopService.getStatisticShop(this.user.shop_id).subscribe(
            (response) => {

              this.dates = response.map((item: any) => item.date);
              this.revenues = response.map((item: any) => item.revenue);

              this.originalDates = [...this.dates];

              console.log(response);

              this.chartOptions_1 = {
                series: [
                  {
                    name: 'Doanh thu',
                    data: this.revenues
                  },
                  // {
                  //   name: 'Đơn hàng',
                  //   data: [31, 40, 68, 31, 92, 55, 100]
                  // },
                  // {
                  //   name: 'Sản phẩm',
                  //   data: [11, 82, 45, 80, 34, 52, 41]
                  // }
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
                colors: ['#0d6efd'], //'#f41127'
                title: {
                  text: 'Đơn hàng',
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
                  categories: this.dates,
                  labels: {
                    formatter: (value: any) => moment(value).format('DD/MM')
                  }
                },
              };

            });


          this.shopService.getStatisticOrder(this.user.shop_id).subscribe(
            (response) => {
              console.log(response);

            }
          )

        }
      });

    // this.chartOptions_2 = {
    //   series: [{
    //     data: [400, 430, 448, 470, 540, 580, 690, 610, 800, 980]
    //   }],
    //   xaxis: {
    //     categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
    //   },
    //   chart: {
    //     foreColor: '#9ba7b2',
    //     type: 'bar',
    //     height: 350
    //   },
    //   colors: ["#0d6efd"],
    //   title: {
    //     text: 'Doanh thu',
    //     align: 'left'
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: true,
    //       columnWidth: '35%',
    //       endingShape: 'rounded',
    //       borderRadius: 5
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   }
    // };

  }
}
