import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import * as moment from 'moment';
import {
  ChartOptions
} from 'src/app/shared/interfaces/chart-options.model';
import {
  ApiTotalUsagePerDay
} from 'src/app/shared/interfaces/api/api-total-usage-per-day.model';
import { COLORS } from 'src/app/shared/global-functions';

interface DayData {
  date: string;
  value: number;
}

@Component({
  selector: 'app-day-by-day-stats',
  templateUrl: './day-by-day-stats.component.html',
  styleUrls: ['./day-by-day-stats.component.scss']
})
export class DayByDayStatsComponent implements OnInit {

  @Input() id = '1';

  public isOpened = false;
  public data: DayData[] = [];

  public chartOptions: Partial < ChartOptions > ;
  public isLoading = true;
  private BIN_SIZE = 5;
  private currCategories: string[] = [];
  private nbNoDataDays = 0;

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    this.currCategories = this.generateCategories(this.BIN_SIZE);
    this.chartOptions = {
      series: [{
        name: 'Number of days per kWh range',
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
        },
        fontFamily: 'Roboto, sans-serif',
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
          text: 'Total used kWh ranges',
          style: {
            fontWeight: 600
          }
        },
        tickPlacement: 'between',
        tooltip: {
          enabled: false
        },
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        title: {
          text: 'Number of days',
          style: {
            fontSize: '12px',
            fontFamily: '',
            fontWeight: 700,
            cssClass: '',
          },
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
        text: 'Number of days per kWh range',
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
          formatter: (val, {
            series,
            seriesIndex,
            dataPointIndex,
            w
          }) => {
            const strVal = val as unknown as string;
            return dataPointIndex === 0 ? '<b>No Data</b>' : '<b>Number of days using between ' + strVal.replace('-', 'and') + ' kWhs</b>';
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
    this.isLoading = true;
    this.dataFetcherSvc.getTotalUsagePerDay(newRange.fromDate, newRange.toDate).subscribe(
      (data) => {
        if (!data.isError) {
          this.setTableData(data);
          this.setDistributionChartData(data);
        } else {
          console.error('Received data error', data);
          this.data = [];
          this.updateChart([]);
        }
      },
      (error) => {
        console.error('Error while fetchig data.', error);
        this.data = [];
        this.updateChart([]);
      },
      () => {
        this.isLoading = false;
      }
    );
  }


  getTotalSum(): string {
    return this.data.reduce((a, b) => a + b.value, 0).toFixed(3);
  }

  private setTableData(data: ApiTotalUsagePerDay): void {
    this.data = data.value.values.map(d => {
      return {
        date: this.transformDate(d.timeFrom),
        value: d.value
      };
    });
  }

  private setDistributionChartData(data: ApiTotalUsagePerDay): void {
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
  }



  private updateChart(newData: number[]): void {
    this.chartOptions.series = [{
      name: 'Number of days per kWh range',
      data: newData
    }];
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

}
