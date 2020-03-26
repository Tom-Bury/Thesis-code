import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import * as moment from 'moment';
import {
  toNgbDate
} from 'src/app/shared/global-functions';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';



@Component({
  selector: 'app-category-bar-chart',
  templateUrl: './category-bar-chart.component.html',
  styleUrls: ['./category-bar-chart.component.scss']
})
export class CategoryBarChartComponent implements OnInit, AfterViewInit {


  private initDateRange: NgbDate[];
  private initTimeRange: NgbTimeStruct[];
  public isLoading = true;
  public spinnerHeight = '291px';

  @ViewChild('chart') chart: ChartComponent;
  @ViewChild('chartWrapper') chartWrapper: ElementRef;

  public chartOptions: Partial < ChartOptions > ;

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    this.initDateRange = [moment().subtract(14, 'd').startOf('day'), moment().subtract(14, 'd').endOf('day')].map(toNgbDate);
    this.initTimeRange = [{
      hour: 0,
      minute: 0,
      second: 0
    }, {
      hour: 23,
      minute: 59,
      second: 0
    }];
    this.chartOptions = this.chartOptions = {
      series: [{
        data: []
      }],
      noData: {
        text: 'Data is unavailable'
      },
      chart: {
        type: 'bar',
        height: 380,
        sparkline: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom'
          }
        }
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          fontSize: '12px',
          colors: ['#fff']
        },
        formatter: (val, opt) => {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        dropShadow: {
          enabled: true,
          opacity: 1,
          blur: 0.1,
          color: '#212529'
        },
        background: {
          enabled: false,
          foreColor: '#fff',
          borderWidth: 0,
          opacity: 0.1
        }
      },
      stroke: {
        show: false
      },
      colors: [
        '#007DFF',
        '#3A99FC',
        '#1085FF',
        '#0059B6',
        '#00448B'
      ],
      xaxis: {
        categories: [],
        labels: {
          show: false
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      title: {
        text: 'Today\'s usage by category',
        align: 'left',
        style: {
          fontWeight: 600,
          fontFamily: 'inherit'
        }
      },
      tooltip: {
        enabled: true,
        x: {
          show: true,
          formatter: (n, opts) => '<b>' + n + '</b>',
      },
      y: {
          title: {
              formatter: (seriesName) => '',
          },
          formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
            return value.toFixed(2) + ' kWh';
          }
      },
      marker: {
        show: false
      }
      },
      legend: {
        show: false
      }
    };
  }


  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateChartSize();
    }, 1);
    setTimeout(() => {
      this.updateForRange(new DatetimeRange(this.initDateRange[0], this.initTimeRange[0],
        this.initDateRange[1], this.initTimeRange[1]));
    }, 50);
  }

  onResize() {
    this.updateChartSize();
  }

  updateForRange(range: DatetimeRange): void {
    this.isLoading = true;
    this.dataFetcherSvc.getSensorsKwh(range.fromDate, range.fromTime, range.toDate, range.toTime).subscribe(
      (data) => {

        if (data.isError) {
          console.error('Error in received week usage data.', data.value);
          this.updateChartData([], []);
        } else {
          const categories = {};
          Object.entries(data.value.values).forEach(sensorEntry => {
            const sensorID = sensorEntry[0];
            const sensorVal = sensorEntry[1] as {fuse: string, value: number};

            const cats = this.dataFetcherSvc.getCategoriesForSensorID(sensorID);
            const kwh = sensorVal.value;
            cats.forEach(cat => {
              if (categories[cat]) {
                categories[cat] += kwh;
              } else {
                categories[cat] = kwh;
              }
            });
          });
          this.updateChartData(Object.values(categories), Object.keys(categories));

        }
      },
      (error) => {
        this.updateChartData([], []);
      },
      () => this.isLoading = false
    );

  }


  updateChartSize(): void {
    const newHeight = this.chartWrapper.nativeElement.clientHeight - 40;
    this.chartOptions.chart.height = newHeight;
    this.spinnerHeight = newHeight + 'px';
    this.chart.updateOptions(this.chartOptions);
  }

  updateChartData(newData: number[], labels: string[]) {
    this.chartOptions.xaxis = {
        categories: labels,
        labels: {
          show: false
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },

      setTimeout(() => {
        const newSeries = [{
          data: newData.map(num => Math.round((num + Number.EPSILON) * 100) / 100)
        }];

        this.chartOptions.series = newSeries;
      }, 1);
  }
}
