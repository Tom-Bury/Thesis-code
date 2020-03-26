import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';

import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';

import {
  ChartComponent
} from 'ng-apexcharts';

import * as moment from 'moment';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import {
  ChartOptions
} from 'src/app/shared/interfaces/chart-options.model';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @ViewChild('chartWrapper') chartWrapper: ElementRef;
  @ViewChild('chart') chart: ChartComponent;

  public isLoading = true;
  public chartOptions: Partial < ChartOptions > ;

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    this.chartOptions = {
      series: [{
        name: 'Total usage in Watts',
        data: []
      }],
      labels: [],
      noData: {
        text: 'Data is unavailable'
      },
      chart: {
        type: 'area',
        height: 450,
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: false // True: hide everything except graph line
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
        text: 'Total usage distribution',
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
          }
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        title: {
          text: 'Total usage in Watts'
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

  ngOnInit(): void {}

  public updateForRange(datetimeRange: DatetimeRange): void {
    this.isLoading = true;

    this.dataFetcherSvc.getTotalWattDistribution(datetimeRange.fromDate, datetimeRange.fromTime,
      datetimeRange.toDate, datetimeRange.toTime).subscribe(
      (data) => {
        const newData = data.value.map(d => d.value);
        const newLabels = data.value.map(d => d.date);
        this.updateChartData(newData, newLabels);
      },
      (error) => {
        this.updateChartData([], []);
      },
      () => this.isLoading = false
    );
  }


  // updateChartSize(): void {
  //   this.chartOptions.chart.height = this.chartWrapper.nativeElement.clientHeight - 50;
  //   this.chart.updateOptions(this.chartOptions);
  // }

  private updateChartData(newData: number[], newLabels: string[]) {
    this.chartOptions.series = [{
      name: 'Total usage in Watts',
      data: newData
    }];
    this.chartOptions.labels = newLabels;
    this.chart.updateOptions(this.chartOptions);
  }


}
