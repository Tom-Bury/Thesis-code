import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit
} from '@angular/core';
import {
  DateTimeRangePickerComponent
} from 'src/app/shared/shared-components/date-time-range-picker/date-time-range-picker.component';
import {
  NgbDate
} from '@ng-bootstrap/ng-bootstrap';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexFill,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexNoData
} from 'ng-apexcharts';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import * as moment from 'moment';
import { toNgbDate } from 'src/app/shared/global-functions';


export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  noData: ApexNoData;
}


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, AfterViewInit {

  @ViewChild('datetimerange', {
    static: false
  }) dateTimeRange: DateTimeRangePickerComponent;
  @Input() public initDateRange: NgbDate[];
  @Input() randomId = 1;
  private previousDateRange: DatetimeRange;
  public isLoading = false;

  @ViewChild('chartWrapper') chartWrapper: ElementRef;
  @ViewChild('chart') chart: ChartComponent;

  public chartOptions: Partial < ChartOptions > = {
    series: [{
      name: 'Day total usage kWh',
      type: 'bar',
      data: []
    }, {
      name: 'Total average',
      type: 'line',
      data: []
    }, {
      name: 'Excluding weekends average',
      type: 'line',
      data: []
    }],
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    legend: {
      position: 'bottom'
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
      enabled: true,
      enabledOnSeries: [0],
      formatter: (val) => {
        return val > 0 ? val.toFixed(2) : '';
      },
      offsetY: -15,
      style: {
        fontSize: '12px',
        colors: ['#212529']
      }
    },
    xaxis: {
      categories: [],
      tickPlacement: 'between',
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: true
      },
      labels: {
        formatter: (val) => {
          return val + ' kWh';
        }
      }
    },
    title: {
      text: 'Total usage in kWh per day',
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
        formatter: (val, opts) => '<b>' + val + '</b>',
      },
      y: [{
        formatter: (value, {
          series,
          seriesIndex,
          dataPointIndex,
          w
        }) => {
          return '<b>' + value.toFixed(2) + ' kWh</b>';

        }
      }, {
        formatter: (value, {
          series,
          seriesIndex,
          dataPointIndex,
          w
        }) => {
          return series[seriesIndex].length > 0 ? '<b>' + value.toFixed(2) + ' kWh</b>' : '';

        }
      }, {
        formatter: (value, {
          series,
          seriesIndex,
          dataPointIndex,
          w
        }) => {
          return series[seriesIndex].length > 0 ? '<b>' + value.toFixed(2) + ' kWh</b>' : '';

        }
      }],
      marker: {
        show: true,
      },
    }


  };



  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
      }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateChartSize();
      this.updateForRange(new DatetimeRange(this.initDateRange[0], {
        hour: 0,
        minute: 0,
        second: 0
      },
      this.initDateRange[1], {
        hour: 23,
        minute: 59,
        second: 0
      }));
    }, 10);
  }

  updateForRange(range: DatetimeRange): void {

    if (!range.equals(this.previousDateRange)) {
      this.isLoading = true;
      this.previousDateRange = range;

      this.dataFetcherSvc.getTotalUsagePerDay(range.fromDate, range.toDate).subscribe(
        (data) => {

          if (data.isError) {
            console.error('Error in received week usage data.', data.value);
            this.updateChartData([], []);
          } else {
            const newData = data.value.values.map(entry => entry.kwh);
            const newLabels = data.value.values.map(entry => this.timeFromToLabelStr(entry.timeFrom));
            const totalAvg = data.value.statistics.totalAvg;
            const weekdayAvg = data.value.statistics.weekdayAvg;
            this.updateChartData(newData, newLabels, totalAvg, weekdayAvg);

          }
        },
        (error) => {
          this.updateChartData([], []);
        },
        () => this.isLoading = false
      );
    }
  }

  private timeFromToLabelStr(timeFrom: string): string {
    // YYYY-MM-DDTHH:mm
    const date = moment(timeFrom, 'YYYY-MM-DDTHH:mm');
    return date.format('dd DD/MM');
  }



  onResize(event) {
    this.updateChartSize();
  }

  updateChartSize(): void {
    this.chartOptions.chart.height = this.chartWrapper.nativeElement.clientHeight - 50;
    this.chart.updateOptions(this.chartOptions);
  }

  updateChartData(newData: number[], labels: string[], totalAvg = 0, weekdayAvg = 0) {
    this.chartOptions.xaxis = {
      categories: labels,
      axisBorder: {
        show: false
      },
      tickPlacement: 'between',
      tooltip: {
        enabled: false
      }
    };

    setTimeout(() => {
      const newSeries = [{
        name: 'Day total usage kWh',
        type: 'bar',
        data: newData
      }];

      if (totalAvg > 0 && newData.length > 1) {
        newSeries.push({
          name: 'Total average',
          type: 'line',
          data: newData.map(d => totalAvg)
        });
      }

      if (weekdayAvg > 0 && (Math.abs(weekdayAvg - totalAvg) > 1)) {
        newSeries.push({
          name: 'Excluding weekends average',
          type: 'line',
          data: newData.map(d => weekdayAvg)
        });
      }

      this.chartOptions.series = newSeries;
    }, 1);
  }


}