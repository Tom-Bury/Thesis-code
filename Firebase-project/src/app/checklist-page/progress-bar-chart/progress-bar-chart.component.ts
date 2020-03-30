import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';

@Component({
  selector: 'app-progress-bar-chart',
  templateUrl: './progress-bar-chart.component.html',
  styleUrls: ['./progress-bar-chart.component.scss']
})
export class ProgressBarChartComponent implements OnInit {

  public isLoading = false;

  public chartOptions: Partial < ChartOptions > ;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'basic',
          data: [5, 4, 4, 3, 2, 2, 0]
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
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
        enabled: false
      },
      xaxis: {
        categories: [
          'Took stairs',
          'Came by bike',
          'Turned off monitor',
          'Unplug chargers',
          'Sweater',
          'Only cook needed amount of water',
          'Carpooled'
        ],
        title: {
          text: 'Amount of times you checked this item off'
        }
      },
      title: {
        text: 'How often you did certain checklist actions',
        align: 'left',
        style: {
          fontWeight: 600,
          fontFamily: 'inherit'
        }
      },
    };
  }

  ngOnInit(): void {
  }

}
