import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import * as moment from 'moment';
import {
  ChartOptions
} from 'src/app/shared/interfaces/chart-options.model';
import { ApiTotalUsagePerDayStatistics } from 'src/app/shared/interfaces/api/api-total-usage-per-day.model';
import { COLORS } from 'src/app/shared/global-functions';

@Component({
  selector: 'app-metrics-summary',
  templateUrl: './metrics-summary.component.html',
  styleUrls: ['./metrics-summary.component.scss']
})
export class MetricsSummaryComponent implements OnInit {

  @Input() id = 1;
  public isOpened = false;
  public chartOptions: Partial < ChartOptions > ;
  public isLoading = true;
  public dataIsUnavailable = false;

  // Statistic values
  public totalAvg: string;
  public weekdayAvg: string;
  public maxDay: string;
  public maxVal: string;
  public minDay: string;
  public minVal: string;
  public nbNoDataDays: number;

  private currCategories: string[] = ['Total avg', 'Weekday avg', 'Maximum', 'Minimum'];

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    this.chartOptions = {
      series: [{
        name: 'Statistics',
        data: []
      }],
      chart: {
        height: 350,
        type: 'bar',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      colors: [COLORS.$dark],
      grid: {
        row: {
          colors: ['#fff', '#f8f9fa']
        }
      },
      legend: {
        show: false
      },
      noData: {
        text: 'Data is unavailable.'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top' // top, center, bottom
          }
        }
      },
      dataLabels: {
        enabled: false,
        enabledOnSeries: [0],
        formatter: (val) => {
          return val > 0 ? val.toFixed(0) : '';
        },
        offsetY: -15,
        style: {
          fontSize: '12px',
          colors: ['#212529']
        }
      },
      xaxis: {
        categories: this.currCategories,
        title: {
          text: '',
          style: {
            fontWeight: 600
          }
        },
        tickPlacement: 'between',
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        title: {
          text: 'kWhs',
          style: {
            fontWeight: 600
          }
        },
        axisTicks: {
          show: true
        },
        labels: {
          formatter: (val) => {
            return val.toFixed(0);
          }
        }
      },
      title: {
        text: 'Statistics',
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
          fontSize: '12px',
          fontFamily: 'inherit'
        },
        onDatasetHover: {
          highlightDataSeries: true,
        },
        x: {
          show: true,
          formatter: (val, { series, seriesIndex, dataPointIndex, w }) => {
            return '<b>' + val + '</b>';
          },
        },
        y: {
          title: {
            formatter: (seriesName) => ''
          },
          formatter: (value, {
            series,
            seriesIndex,
            dataPointIndex,
            w
          }) => {
            return '<b>' + value + ' kWhs</b>';
          }
        },
        marker: {
          show: true,
        },
      }
    };

  }

  ngOnInit(): void {}

  fetchNewData(newRange: DatetimeRange): void {
    this.dataIsUnavailable = false;
    this.isLoading = true;
    this.dataFetcherSvc.getTotalUsagePerDay(newRange.fromDate, newRange.toDate).subscribe(
      (data) => {
        if (!data.isError) {
          if (data.value.values.some(v => v.value > 0)) {
            this.setStatistics(data.value.statistics);
          } else {
            this.dataIsUnavailable = true;
            this.setStatisticsOnlyNoData();
          }
        } else {
          console.error('Received data error', data);
          this.dataIsUnavailable = true;
          this.setStatisticsOnlyNoData();
        }
      },
      (error) => {
        console.error('Error while fetching the data.', error);
        this.dataIsUnavailable = true;
        this.setStatisticsOnlyNoData();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  private setStatistics(stats: ApiTotalUsagePerDayStatistics): void {
    const max = stats.max ? this.roundNb(stats.max.value) : 0;
    const min = stats.min ? this.roundNb(stats.min.value) : 0;
    const avg = stats.totalAvg ? this.roundNb(stats.totalAvg) : 0;
    const wdAvg = stats.weekdayAvg ? this.roundNb(stats.weekdayAvg) : 0;

    this.totalAvg = avg.toString();
    this.weekdayAvg = wdAvg.toString();
    this.maxDay = stats.max.value ? this.transformDate(stats.max.timeFrom) : '0';
    this.maxVal = max.toString();
    this.minDay = stats.min ? this.transformDate(stats.min.timeFrom) : '0';
    this.minVal = min.toString();

    this.updateChart([avg, wdAvg, max, min]);
  }

  private setStatisticsOnlyNoData(): void {
    this.totalAvg = 'Data unavailable';
    this.weekdayAvg = 'Data unavailable';
    this.maxDay = 'Data unavailable';
    this.maxVal = 'Data unavailable';
    this.minDay = 'Data unavailable';
    this.minVal = 'Data unavailable';

    this.updateChart([]);
  }

  private transformDate(fromDateString: string): string {
    const date = moment(fromDateString, 'YYYY-MM-DDTHH:mm');
    return date.format('dd D MMM YYYY');
  }


  private updateChart(newData: number[]): void {
    this.chartOptions.series = [{
      name: 'Statistics',
      data: newData
    }];
  }

  private roundNb(num: number, digits: number = 3): number {
    const factor = 10 ** digits;
    return Math.round((num + Number.EPSILON) * factor) / factor;
  }
}
