import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js';

// Chart.register(
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
//   LineController
// );


@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css'
})
export class StatisticComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {

  }

  @ViewChild('chart7') chart7!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {

    const ctx = this.chart7.nativeElement.getContext('2d');

    // if (ctx) {

    //   const gradientStroke1 = ctx.createLinearGradient(0, 0, 0, 300);
    //   gradientStroke1.addColorStop(0, '#008cff');
    //   gradientStroke1.addColorStop(1, 'rgba(22, 195, 233, 0.1)');

    //   // Khởi tạo chart
    //   const myChart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //       labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //       datasets: [{
    //         label: 'Revenue',
    //         data: [3, 30, 10, 10, 22, 12, 5],
    //         pointBorderWidth: 2,
    //         pointHoverBackgroundColor: gradientStroke1,
    //         backgroundColor: gradientStroke1,
    //         borderColor: gradientStroke1,
    //         borderWidth: 3
    //       }]
    //     },
    //     options: {
    //       maintainAspectRatio: false,
    //       plugins: {
    //         legend: {
    //           position: 'bottom',
    //           display: false
    //         },
    //         tooltip: {
    //           displayColors: false,
    //           mode: 'nearest',
    //           intersect: false,
    //           position: 'nearest',
    //           padding: 10,
    //           caretPadding: 10
    //         }
    //       },
    //       scales: {
    //         x: {
    //           beginAtZero: true,
    //           ticks: {
    //             color: '#585757'
    //           },
    //           grid: {
    //             display: true,
    //             color: 'rgba(0, 0, 0, 0.07)'
    //           }
    //         },
    //         y: {
    //           beginAtZero: true,
    //           ticks: {
    //             color: '#585757'
    //           },
    //           grid: {
    //             display: true,
    //             color: 'rgba(0, 0, 0, 0.07)'
    //           }
    //         }
    //       }
    //     }
    //   });
    // }

    // var options = {
    //   series: [{
    //     name: 'series1',
    //     data: [31, 40, 68, 31, 92, 55, 100]
    //   }, {
    //     name: 'series2',
    //     data: [11, 82, 45, 80, 34, 52, 41]
    //   }],
    //   chart: {
    //     foreColor: '#9ba7b2',
    //     height: 360,
    //     type: 'area',
    //     zoom: {
    //       enabled: false
    //     },
    //     toolbar: {
    //       show: true
    //     },
    //   },
    //   colors: ["#0d6efd", '#f41127'],
    //   title: {
    //     text: 'Area Chart',
    //     align: 'left',
    //     style: {
    //       fontSize: "16px",
    //       color: '#666'
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   stroke: {
    //     curve: 'smooth'
    //   },
    //   xaxis: {
    //     type: 'datetime',
    //     categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
    //   },
    //   tooltip: {
    //     x: {
    //       format: 'dd/MM/yy HH:mm'
    //     },
    //   },
    // };
    // var chart = new ApexCharts(document.querySelector("#chart3"), options);
    // chart.render();
  }
}
