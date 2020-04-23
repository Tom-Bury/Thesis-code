import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';

@Component({
  selector: 'app-points-distribution-chart',
  templateUrl: './points-distribution-chart.component.html',
  styleUrls: ['./points-distribution-chart.component.scss']
})
export class PointsDistributionChartComponent implements OnInit {


  public chartOptions: Partial<ChartOptions>;

  constructor() { }


  ngOnInit(): void {
    this.chartOptions = {
      series: [
        {
          name: 'You',
          data: [40, 25, 15, 90]
        },
      ],
      chart: {
        type: 'bar',
        height: 180,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: true
      },
      xaxis: {
        categories: ['Logging in frequently', 'Discussion board activity', 'Exploring the data', 'Checklist'],
        title: {
          text: 'Points',
          style: {
            fontWeight: 600
          }
        }
      },
      title: {
        text: 'Where you get your points from',
        align: 'left',
        style: {
          fontWeight: 600,
          fontFamily: 'inherit'
        }
      },
      tooltip: {
        enabled: false,
      }

    };
  }

}
