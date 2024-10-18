import { Component, OnInit } from '@angular/core';
import ApexCharts, { ApexOptions } from 'apexcharts';

@Component({
  selector: 'app-admin-event',
  standalone: true,
  imports: [],
  templateUrl: './admin-event.component.html',
  styleUrl: './admin-event.component.css'
})
export class AdminEventComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.renderBarChart();
  }

  renderBarChart(): void {
    const barChartOptions: ApexOptions = {
      chart: {
        type: 'bar',
        height: 360
      },
      stroke: { show: true, width: 2, colors: ['transparent'] },
      colors: ["#212529", '#0d6efd', '#ffc107'],
      series: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
      }, {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
      }, {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
      }],
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      title: {
        text: 'Column Chart',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 10,
        },
      },
      dataLabels: {
        enabled: false
      },
      yaxis: {
        title: {
          text: 'Engagement'
        }
      }
    };

    const barChart = new ApexCharts(document.querySelector('#chart4'), barChartOptions);
    barChart.render();
  }
}
