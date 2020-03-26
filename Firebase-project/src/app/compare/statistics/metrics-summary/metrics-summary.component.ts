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

@Component({
  selector: 'app-metrics-summary',
  templateUrl: './metrics-summary.component.html',
  styleUrls: ['./metrics-summary.component.scss']
})
export class MetricsSummaryComponent implements OnInit {

  @Input() id = 1;
  public isOpened = false;
  public chartOptions: Partial < ChartOptions > ;
  public isLoading = false;
  public dataIsUnavailable = false;

  // Statistic values
  public totalAvg: string;
  public weekdayAvg: string;
  public maxDay: string;
  public maxVal: string;
  public minDay: string;
  public minVal: string;
  public nbNoDataDays: number;

  private BIN_SIZE = 5;
  private currCategories: string[] = [];

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    this.currCategories = this.generateCategories(this.BIN_SIZE);
    this.chartOptions = {
      series: [{
        name: 'Distribution of total usage',
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
          text: 'Total used kWh bins'
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
          text: 'Number of days per bin'
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
        text: 'Distribution of total usage',
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
            return dataPointIndex === 0 ? '<b>No Data</b>' : '<b>kWh range: [' + val + ')</b>';
          },
        },
        y: {
          formatter: (value, {
            series,
            seriesIndex,
            dataPointIndex,
            w
          }) => {
            const endPart = value === 1 ? ' day</b>' : ' days</b>';
            return '<b>' + value.toFixed(0) + endPart;
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
    this.dataFetcherSvc.getTotalUsagePerDay(newRange.fromDate, newRange.toDate).subscribe(
      (data) => {
        if (!data.isError) {
          if (data.value.values.some(v => v.value > 0)) {
            this.setStatistics(data.value.statistics);

            const newData = this.currCategories.map(v => 0);
            const nbCategories = this.currCategories.length;
            this.nbNoDataDays = 0;
            data.value.values.forEach(v => {
              const binIndex = this.getBinNb(v.value, this.BIN_SIZE);
              const trimmedIndex = binIndex >= nbCategories ? nbCategories - 1 : binIndex;
              newData[trimmedIndex] += 1;
              if (v.value === 0) {
                this.nbNoDataDays++;
              }
            });
            this.updateChart(newData);

          } else {
            this.dataIsUnavailable = true;
            this.setStatisticsOnlyNoData();
            this.updateChart([]);
          }
        } else {
          console.error('Received data error', data);
          this.dataIsUnavailable = true;
          this.setStatisticsOnlyNoData();
          this.updateChart([]);
        }
      }
    );
  }

  private setStatistics(stats: ApiTotalUsagePerDayStatistics): void {
    this.totalAvg = stats.totalAvg ? stats.totalAvg.toFixed(3) : '0';
    this.weekdayAvg = stats.weekdayAvg ? stats.weekdayAvg.toFixed(3) : '0';
    this.maxDay = stats.max.value ? this.transformDate(stats.max.timeFrom) : '0';
    this.maxVal = stats.max ? stats.max.value.toFixed(3) : '0';
    this.minDay = stats.min ? this.transformDate(stats.min.timeFrom) : '0';
    this.minVal = stats.min ? stats.min.value.toFixed(3) : '0';
  }

  private setStatisticsOnlyNoData(): void {
    this.totalAvg = 'Data unavailable';
    this.weekdayAvg = 'Data unavailable';
    this.maxDay = 'Data unavailable';
    this.maxVal = 'Data unavailable';
    this.minDay = 'Data unavailable';
    this.minVal = 'Data unavailable';
  }

  private transformDate(fromDateString: string): string {
    const date = moment(fromDateString, 'YYYY-MM-DDTHH:mm');
    return date.format('dd D MMM YYYY');
  }

  private generateCategories(binSize: number, min = 0, max = 50): string[] {
    const categories = ['No data'];
    let currMin = min;
    let currMax = binSize;

    while (currMax <= max) {
      categories.push(currMin + ' - ' + currMax);
      currMin += binSize;
      currMax += binSize;
    }

    categories.push('≥ ' + max);

    return categories;
  }

  private getBinNb(kWhValue: number, binSize: number): number {
    return kWhValue === 0 ? 0 : Math.floor(kWhValue / binSize) + 1;
  }

  private updateChart(newData: number[]): void {
    this.chartOptions.series = [{
      name: 'Distribution of total usage',
      data: newData
    }];
  }
}
