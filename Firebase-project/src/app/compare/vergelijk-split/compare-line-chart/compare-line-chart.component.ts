import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  toNgbDate, ngbDateTimeToApiString
} from 'src/app/shared/global-functions';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexDataLabels,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexTooltip,
  ApexNoData,
  ChartComponent
} from 'ng-apexcharts';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  NgForm,
  FormBuilder,
  Validators
} from '@angular/forms';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  noData: ApexNoData;
}

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
  @ViewChild('hiddenButton') hiddenButton: ElementRef;

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

  public isLoading = false;
  public isToggledOpen = false;
  private currentRange: DatetimeRange;

  public extraRanges: ExtraDatetimeRange[] = [];
  public extraRangeOptions = ['Hour(s)', 'Day(s)', 'Week(s)', 'Month(s)'];
  public extraRangeForm = this.fb.group({
    differenceAmount: [0, Validators.required],
    difference: ['Day(s)', Validators.required]
  });
  public seriesNameToEasyString = {};

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
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 4
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
        fontSize: '12px',
        fontFamily: 'inherit'
      },
      onDatasetHover: {
        highlightDataSeries: true,
      },
      x: {
        show: true,
        format: 'dd MMM yyyy @ HH:mm',
        formatter: (val, opts) => '<b>Main: ' + moment(val).format('DD MMM YYYY @ HH:mm') + '</b>',
      },
      y: {
        title: {
          formatter: (seriesName) => this.seriesNameToEasyString[seriesName],
        },
        formatter: (value, opts) => {
          return '<b>' + value.toFixed(2) + 'W</b>';
        }
      },
      marker: {
        show: true,
      },
    }

  };

  constructor(
    private dataFetcherSvc: DataFetcherService,
    private fb: FormBuilder
  ) {
    this.currentRange = new DatetimeRange(this.initDateRange[0], this.initTimeRange[0],
      this.initDateRange[1], this.initTimeRange[1]);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateForRange(new DatetimeRange(this.initDateRange[0], this.initTimeRange[0],
        this.initDateRange[1], this.initTimeRange[1]));
    }, 10);
  }

  updateForRange(newRange: DatetimeRange): void {
    if (!newRange.equals(this.currentRange)) {
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

      this.dataFetcherSvc.getMultipleTotalUsageDistributions(fromDates, fromTimes, toDates, toTimes).subscribe(
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


            this.seriesNameToEasyString = {};

            if (labels.length > 2) {
              const intervalMillis = labels[1] - labels[0];
              const newDatasets = data.value.map((resp, i) => {
                this.seriesNameToEasyString[resp.timeFrom + ' to ' + resp.timeTo] = i === 0 ? 'Main date range' : this.extraRanges[i - 1].name;

                const nbDataPoints = resp.values.length;
                if (nbDataPoints < maxNbLabels) {
                  const zeroes = Array.from(Array(maxNbLabels - nbDataPoints), () => 0);
                  const thisQueryStartDateMillis = +moment(ngbDateTimeToApiString(fromDates[i], fromTimes[i]), 'DD/MM/YYYY-HH:mm');
                  if (resp.values[0].dateMillis > intervalMillis + 3600000 + thisQueryStartDateMillis) {
                    // TODO: fix dates + 1 hour this 3 600 000 milliseconds stuff.
                    // Check with 12/3/2020 @00:00 to 12/3/2020 @23:59  & 1 day earlier	11/3/2020 @00:00 to 11/3/2020 @23:59
                    return {
                      name: resp.timeFrom + ' to ' + resp.timeTo,
                      data: zeroes.concat(resp.values.map(v => v.value))
                    };
                  } else {
                    return {
                      name: resp.timeFrom + ' to ' + resp.timeTo,
                      data:resp.values.map(v => v.value).concat(zeroes)
                    };
                  }
                } else {
                  return {
                    name: resp.timeFrom + ' to ' + resp.timeTo,
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


  private updateChart(newDataSets: ApexAxisChartSeries, newLabels: string[]): void {
    this.chartOptions.series = newDataSets;
    this.chartOptions.labels = newLabels;
    this.chart.updateOptions(this.chartOptions);
  }

  onFabPress(): void {
    this.isToggledOpen = !this.isToggledOpen;
    this.hiddenButton.nativeElement.click();
  }

  getCurrentFormattedDatetimeRange(): string {
    return this.currentRange.toString();
  }

  addExtraDateRange(): void {
    if (this.extraRangeForm.valid && this.extraRangeForm.value.differenceAmount !== 0) {
      const extraRange = this.calculateExtraDatetimeRange(this.extraRangeForm.value.differenceAmount,
        this.extraRangeForm.value.difference);
      this.extraRanges.push(extraRange);
    }
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
      diff: this.extraRangeForm.value.difference
    };
  }

  private updateExtraRanges(): void {
    this.extraRanges = this.extraRanges.map(old => this.calculateExtraDatetimeRange(old.diffAmount, old.diff));
  }

}
