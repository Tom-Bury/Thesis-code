import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';

import * as moment from 'moment';
import { ApiAllSensorsWattDistributionEntry } from 'src/app/shared/interfaces/api/api-all-sensors-watt-distribution.model';

@Component({
  selector: 'app-sensor-distribution-chart',
  templateUrl: './sensor-distribution-chart.component.html',
  styleUrls: ['./sensor-distribution-chart.component.scss']
})
export class SensorDistributionChartComponent implements OnInit {

  @Input() data: {date: string, dateMillis: number, value: number}[];
  @Input() sensorID: string;

  public chartOptions: Partial < ChartOptions >;

  constructor() {
    this.chartOptions = {
      series: [{
        name: 'Sensor\'s usage in Watts',
        data: []
      }],
      labels: [],
      noData: {
        text: 'Data is unavailable'
      },
      chart: {
        type: 'area',
        height: '50',
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true // True: hide everything except graph line
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      title: {
        text: 'Title',
        align: 'left',
        style: {
          fontWeight: 600,
          fontFamily: 'inherit'
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM \'yy',
            day: 'dd MMM',
            hour: 'HH:mm'
          },
          datetimeUTC: false
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        title: {
          text: 'Sensor usage in Watts',
          style: {
            fontSize: '12px',
            fontFamily: '',
            fontWeight: 550,
            cssClass: '',
          },
        },
        decimalsInFloat: 0
      },
      legend: {
        show: false
      },
      tooltip: {
        enabled: true,
        followCursor: true,
        fillSeriesColor: false,
        theme: 'light',
        style: {
          fontSize: '12px',
          fontFamily: 'inherit'
        },
        onDatasetHover: {
          highlightDataSeries: true,
        },
        x: {
          show: true,
          format: 'dd MMM yyyy @ HH:mm',
          formatter: (val, opts) => '<b>' + moment(val).format('DD MMM YYYY @ HH:mm') + '</b>',
        },
        y: {
          title: {
            formatter: (seriesName) => seriesName,
          },
          formatter: (value, opts) => {
            return '<b>' + value.toFixed(2) + '</b>';
          }
        },
        marker: {
          show: true,
        },
      }
    };
  }

  ngOnInit(): void {
    this.chartOptions.labels = this.data.map(d => d.date);
    this.chartOptions.series = [{
      name: 'Sensor\'s usage in Watts',
      data: this.data.map(d => d.value)
    }];
  }

  public updateChart(sensorData: ApiAllSensorsWattDistributionEntry[]): void {
    console.log('update me lol');
  }

}
