import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-statistic',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css'
})
export class StatisticComponent implements OnInit {

  chartOptions_1: any;
  chartOptions_2: any;

  constructor() { }

  ngOnInit(): void {

    this.chartOptions_1 = {
      series: [{
        name: 'Hoàn thành',
        data: [31, 40, 68, 31, 92, 55, 100]
      }, {
        name: 'Hủy',
        data: [11, 82, 45, 80, 34, 52, 41]
      }],
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
      colors: ["#0d6efd", '#f41127'],
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
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },
    };

    this.chartOptions_2 = {
      series: [{
        data: [400, 430, 448, 470, 540, 580, 690, 610, 800, 980]
      }],
      xaxis: {
        categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
      },
      chart: {
        foreColor: '#9ba7b2',
        type: 'bar',
        height: 350
      },
      colors: ["#0d6efd"],
      title: {
        text: 'Doanh thu',
        align: 'left'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: '35%',
          endingShape: 'rounded',
          borderRadius: 5
        }
      },
      dataLabels: {
        enabled: false
      }
    };

  }
}
