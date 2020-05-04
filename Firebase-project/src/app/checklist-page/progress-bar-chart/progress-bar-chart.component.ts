import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';
import { ChartComponent, ApexAxisChartSeries } from 'ng-apexcharts';
import { COLORS } from 'src/app/shared/global-functions';

@Component({
  selector: 'app-progress-bar-chart',
  templateUrl: './progress-bar-chart.component.html',
  styleUrls: ['./progress-bar-chart.component.scss']
})
export class ProgressBarChartComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent;

  public isLoading = false;
  private userData: number[] = [];

  public chartOptions: Partial < ChartOptions > ;
  private labels = [
    'Took stairs',
    'Came by bike',
    'Turned off monitor',
    'Unplug chargers',
    'Sweater',
    'Only cook needed amount of water',
    'Carpooled'
  ];

  constructor() {
    this.userData = this.getRandomArray(7, 0, 7);
    this.chartOptions = {
      series: [
        {
          name: 'You',
          data: this.userData
        },
      ],
      colors: [COLORS.$dark, COLORS.$warning],
      chart: {
        type: 'bar',
        height: 300,
        toolbar: {
          show: false
        },
        fontFamily: 'Roboto, sans-serif',
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
          text: 'Amount of times item was checked',
          style: {
            fontWeight: 600
          }
        }
      },
      title: {
        text: 'How often you did checklist actions in the selected time period',
        align: 'left',
        style: {
          fontWeight: 600,
          fontFamily: 'inherit'
        }
      },
      tooltip: {
        enabled: true,
        followCursor: true,
        fillSeriesColor: false,
        theme: 'light',
        style: {
          fontSize: '0.8rem',
          fontFamily: 'inherit'
        },
        onDatasetHover: {
          highlightDataSeries: true,
        },
        x: {
          show: true,
          formatter: (val, { series, seriesIndex, dataPointIndex, w }) => '<b>' + this.labels[dataPointIndex] + '</b>',
        },
        y: {
          title: {
            formatter: (seriesName) => '<b>' + seriesName + '</b>',
          },
          formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
            const data = series[0][dataPointIndex];
            return data.toFixed(0) + ' times';
          }
        },
        marker: {
          show: true,
        },
      }

    };
  }

  ngOnInit(): void {
  }


  public addRandomData(label: string): void {
    const newChartSeries: ApexAxisChartSeries = [];
    const ogData = (this.chartOptions.series[0] as any).data;
    newChartSeries.push({
      name: 'You',
      type: 'bar',
      data: ogData
    });
    const newData = {
      name: label,
      type: 'bar',
      data: this.getRandomArray(7, 0, 7)
    };
    newChartSeries.push(newData);
    this.chart.updateSeries(newChartSeries);
  }

  public removeRandomData(): void {
    const newChartSeries: ApexAxisChartSeries = [];
    const ogData = (this.chartOptions.series[0] as any).data;
    newChartSeries.push({
      name: 'You',
      type: 'bar',
      data: ogData
    });
    this.chart.updateSeries(newChartSeries);
  }

  private getRandomArray(length: number, min: number, max: number): number[] {
    const result = [];
    while (result.length < length) {
      let r = Math.random() * max;
      r = r < min ? r + min : r;
      const randomNb = Math.floor(r);
      result.push(randomNb);
    }
    return result;
  }

}
