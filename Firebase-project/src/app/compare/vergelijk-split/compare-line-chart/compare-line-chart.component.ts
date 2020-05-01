import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ComponentRef
} from '@angular/core';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  toNgbDate,
  ngbDateTimeToApiString,
  COLORS
} from 'src/app/shared/global-functions';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import {
  ChartComponent,
  ApexAxisChartSeries
} from 'ng-apexcharts';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ChartOptions
} from 'src/app/shared/interfaces/chart-options.model';
import {
  ShareButtonComponent
} from 'src/app/shared/shared-components/share-button/share-button.component';
import {
  DateTimeRangePickerComponent
} from 'src/app/shared/shared-components/date-time-range-picker/date-time-range-picker.component';
import { UserService } from 'src/app/shared/services/user.service';

interface ExtraDatetimeRange {
  name: string;
  range: DatetimeRange;
  diffAmount: number;
  diff: string;
}


@Component({
  selector: 'app-compare-line-chart',
  templateUrl: './compare-line-chart.component.html',
  styleUrls: ['./compare-line-chart.component.scss']
})
export class CompareLineChartComponent implements OnInit, AfterViewInit {

  @ViewChild('chart') chart: ChartComponent;
  @ViewChild('shareBtn') shareBtn: ShareButtonComponent;
  @ViewChild('datetimerange') datetimerangePicker: DateTimeRangePickerComponent;

  @Input() randomId = 0;
  @Input() initDateRange: NgbDate[] = [moment().startOf('day'), moment().endOf('day')].map(toNgbDate);
  @Input() initTimeRange: NgbTimeStruct[] = [{
    hour: 0,
    minute: 0,
    second: 0
  }, {
    hour: 23,
    minute: 59,
    second: 0
  }];
  @Input() selfRef: ComponentRef < CompareLineChartComponent > ;

  public isLoading = false;
  public isToggledOpen = false;
  private currentRange: DatetimeRange;

  public extraRanges: ExtraDatetimeRange[] = [];
  public extraRangeOptions = ['Hour(s)', 'Day(s)', 'Week(s)', 'Month(s)'];
  public extraRangeForm = this.fb.group({
    differenceAmount: [2, Validators.required],
    difference: ['Week(s)', Validators.required]
  });

  public MAX_NB_EXTRA_RANGES = 3;

  private rangesDataLabels = [];

  private chartLineColors = [COLORS.$dark , COLORS.$success, COLORS.$warning, COLORS.$danger, COLORS.$info];


  public chartOptions: Partial < ChartOptions > = {
    series: [{
      name: 'Total usage in Watts',
      data: []
    }],
    labels: [],
    noData: {
      text: 'Data is unavailable'
    },
    chart: {
      type: 'line',
      height: 450,
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: false // True: hide everything except graph line
      },
      toolbar: {
        show: false
      },
      fontFamily: 'Roboto, sans-serif',
    },
    colors: this.chartLineColors,
    stroke: {
      curve: 'smooth',
      width: 2
    },
    dataLabels: {
      enabled: false
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
          year: 'HH:mm',
          month: 'HH:mm',
          day: 'HH:mm',
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
        text: 'Total usage in Watts',
        style: {
          fontSize: '12px',
          fontFamily: '',
          fontWeight: 700,
          cssClass: '',
        },
      },
      decimalsInFloat: 0
    },
    legend: {
      show: true,
      itemMargin: {
        vertical: 5
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
        format: 'dd MMM yyyy @ HH:mm',
        formatter: (val, opts) => '<b>Time of day: ' + moment(val).format('HH:mm') + '</b>',
      },
      y: {
        title: {
          formatter: (seriesName) => seriesName,
        },
        formatter: (value, {
          series,
          seriesIndex,
          dataPointIndex,
          w
        }) => {
          const date = this.rangesDataLabels[seriesIndex][dataPointIndex];
          const dateStr = date > 0 ? moment(date).format('DD MMM YYYY') : '';
          return dateStr + ': <b>' + value.toFixed(2) + 'W</b>';
        }
      },
      marker: {
        show: true,
      },
    }

  };

  constructor(
    private dataFetcherSvc: DataFetcherService,
    private fb: FormBuilder,
    public currUser: UserService
  ) {
    this.currentRange = new DatetimeRange(this.initDateRange[0], this.initTimeRange[0],
      this.initDateRange[1], this.initTimeRange[1]);
  }

  ngOnInit(): void {
    const extraRange = this.calculateExtraDatetimeRange(1, 'Week(s)');
    this.extraRanges.push(extraRange);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateForRange(new DatetimeRange(this.initDateRange[0], this.initTimeRange[0],
        this.initDateRange[1], this.initTimeRange[1]), true);
    }, 10);
  }

  reloadChart(): void {
    this.updateForRange(this.currentRange, true);
  }

  updateForRange(newRange: DatetimeRange, reload = false): void {
    if (!newRange.equals(this.currentRange) || reload) {
      this.currentRange = newRange;
      this.isLoading = true;
      this.updateExtraRanges();

      const fromDates = [newRange.fromDate];
      const fromTimes = [newRange.fromTime];
      const toDates = [newRange.toDate];
      const toTimes = [newRange.toTime];

      this.extraRanges.forEach(extraRange => {
        fromDates.push(extraRange.range.fromDate);
        fromTimes.push(extraRange.range.fromTime);
        toDates.push(extraRange.range.toDate);
        toTimes.push(extraRange.range.toTime);
      });

      this.dataFetcherSvc.getTotalWattDistributionMultiple(fromDates, fromTimes, toDates, toTimes).subscribe(
        (data) => {
          if (!data.isError) {
            let maxNbLabels = 0;
            let labels = [];
            data.value.forEach(resp => {
              if (resp.values.length > maxNbLabels) {
                labels = resp.values.map(v => v.dateMillis);
                maxNbLabels = resp.values.length;
              }
            });

            this.rangesDataLabels = [];


            if (labels.length > 2) {
              const intervalMillis = labels[1] - labels[0];
              const newDatasets = data.value.map((resp, i) => {

                const nbDataPoints = resp.values.length;

                if (nbDataPoints < maxNbLabels) {
                  const zeroes = Array.from(Array(maxNbLabels - nbDataPoints), () => 0);
                  const thisQueryStartDateMillis = +moment(ngbDateTimeToApiString(fromDates[i], fromTimes[i]), 'DD/MM/YYYY-HH:mm');
                  const currFirstMillis = resp.values.length > 0 ? resp.values[0].dateMillis : 0;

                  if (currFirstMillis > intervalMillis + thisQueryStartDateMillis) {
                    // TODO: fix dates + 1 hour this 3 600 000 milliseconds stuff.
                    // Check with 12/3/2020 @00:00 to 12/3/2020 @23:59  & 1 day earlier	11/3/2020 @00:00 to 11/3/2020 @23:59
                    this.rangesDataLabels.push(zeroes.concat(resp.values.map(v => v.dateMillis)));
                    return {
                      name: i === 0 ? 'Main date range' : this.extraRanges[i - 1].name,
                      data: zeroes.concat(resp.values.map(v => v.value))
                    };
                  } else {
                    this.rangesDataLabels.push(resp.values.map(v => v.dateMillis).concat(zeroes));
                    return {
                      name: i === 0 ? 'Main date range' : this.extraRanges[i - 1].name,
                      data: resp.values.map(v => v.value).concat(zeroes)
                    };
                  }
                } else {
                  this.rangesDataLabels.push(resp.values.map(v => v.dateMillis));
                  return {
                    name: i === 0 ? 'Main date range' : this.extraRanges[i - 1].name,
                    data: resp.values.map(v => v.value)
                  };
                }
              });

              this.updateChart(newDatasets, labels);

            } else {
              console.error('Something wrong with the received data', data.value);
              this.updateChart([], []);
            }

          } else {
            console.error(data.value);
            this.updateChart([], []);
          }
        },
        (error) => {
          console.error(error);
          this.updateChart([], []);
        },
        () => this.isLoading = false
      );
    }
  }


  private updateChart(newDataSets: ApexAxisChartSeries, newLabels): void {
    this.chartOptions.series = newDataSets;
    this.chartOptions.labels = newLabels;
    this.chart.updateOptions(this.chartOptions);
  }


  getCurrentFormattedDatetimeRange(): string {
    return this.currentRange.toString();
  }


  editMainRange(): void {
    this.datetimerangePicker.toggleFromOutside();
  }

  addExtraDateRange(): void {
    if (this.extraRangePossible()) {
      const extraRange = this.calculateExtraDatetimeRange(this.extraRangeForm.value.differenceAmount,
        this.extraRangeForm.value.difference);
      this.extraRanges.push(extraRange);
      this.reloadChart();
    }
  }

  removeExtraRangeAtPosition(index: number): void {
    this.extraRanges.splice(index, 1);
    this.reloadChart();
  }

  extraRangePossible(): boolean {
    return this.extraRanges.length < this.MAX_NB_EXTRA_RANGES &&
      this.extraRangeForm.valid &&
      this.extraRangeForm.value.differenceAmount !== 0;
  }

  private calculateExtraDatetimeRange(diffAmount: number, diff: string): ExtraDatetimeRange {
    let interval: string;
    let momentJSInterval: string;
    switch (diff) {
      case 'Hour(s)':
        interval = diffAmount > 1 ? ' hours' : ' hour';
        momentJSInterval = 'h';
        break;
      case 'Day(s)':
        interval = diffAmount > 1 ? ' days' : ' day';
        momentJSInterval = 'd';
        break;
      case 'Week(s)':
        interval = diffAmount > 1 ? ' weeks' : ' week';
        momentJSInterval = 'w';
        break;
      case 'Month(s)':
        interval = diffAmount > 1 ? ' months' : ' month';
        momentJSInterval = 'M';
        break;
      default:
        console.error('This option was not implemented');
        return;
    }

    return {
      name: diffAmount + interval + ' earlier',
      range: this.currentRange.subtract(diffAmount, momentJSInterval),
      diffAmount,
      diff
    };
  }

  private updateExtraRanges(): void {
    this.extraRanges = this.extraRanges.map(old => this.calculateExtraDatetimeRange(old.diffAmount, old.diff));
  }

  public shareChart(): void {
    this.shareBtn.shareChart(this.chart, this.currentRange, 'Comparison of total usage in Watts');
  }

  public removeChart(): void {
    this.selfRef.destroy();
  }

}
