import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  ChartOptions,
  ChartType,
  ChartDataSets
} from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import {
  Label,
} from 'ng2-charts';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import { DateTimeRangePickerComponent } from 'src/app/shared/shared-components/date-time-range-picker/date-time-range-picker.component';
import { DatetimeRange } from 'src/app/shared/interfaces/datetime-range.model';
import * as moment from 'moment';
import { toNgbDate } from 'src/app/shared/global-functions';
import { ApiStatistics } from 'src/app/shared/interfaces/api-interfaces/api-statistics.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  @ViewChild('datetimerange', {static: false}) dateTimeRange: DateTimeRangePickerComponent;
  public initDateRange = [moment().day(1), moment().day(7)].map(toNgbDate);
  private previousDateRange: DatetimeRange;

  private avgLineOptions = {
    drawTime: 'afterDraw',
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: 0,
    borderColor: '#dc3545',
    borderWidth: 4,
    label: {
      backgroundColor: '#dc3545',
      fontSize: 12,
      fontColor: '#fff',
      xPadding: 6,
      yPadding: 6,
      cornerRadius: 5,
      position: 'right',
      xAdjust: 10,
      yAdjust: -15,
      enabled: true,
      content: 'Average'
    },
  };

  private workweekAvgLineOptions = {
    drawTime: 'afterDraw',
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: 0,
    borderColor: '#E85D2C',
    borderWidth: 4,
    label: {
      backgroundColor: '#E85D2C',
      fontSize: 12,
      fontColor: '#fff',
      xPadding: 6,
      yPadding: 6,
      cornerRadius: 5,
      position: 'right',
      xAdjust: 10,
      yAdjust: -15,
      enabled: true,
      content: 'Work week average'
    },
  };

  public barChartOptions: (ChartOptions & {
    annotation: any
  }) = {
    responsive: true,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 0,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    legend: {
      display: false,
      position: 'bottom'
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Day total usage in kWh',
        },
        ticks: {
          padding: 4,
          min: 0,
          suggestedMax: 50,
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Date'
        }
      }]
    },
    tooltips: {
      position: 'nearest',
      backgroundColor: '#191919',
      titleFontStyle: 'bold',
      titleFontSize: 16,
      titleFontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Helvetica Neue\', Arial, sans-serif',
      bodyFontSize: 14,
      bodyFontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Helvetica Neue\', Arial, sans-serif',
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value, context) => {
          return value.toFixed(2) + ' kWh';
        },
        display: (context) => {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return value > 0;
        },
      },
    },

    annotation: {
      annotations: [this.avgLineOptions]
    },
  };

  public showChart = false;
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [pluginDataLabels, pluginAnnotations];

  public barChartData: ChartDataSets[] = [{
    data: [0, 0, 0, 0, 0, 0, 0],
    label: 'Total usage in kWh',
    backgroundColor: '#007bff',
    borderColor: '#180DFF',
    borderWidth: 0,
    hoverBackgroundColor: '#0C3CE8',
    hoverBorderColor: '#180DFF',
    hoverBorderWidth: 0,
  }, ];


  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {}

  ngOnInit(): void {
    this.updateForRange(new DatetimeRange(this.initDateRange[0], {hour: 0, minute: 0, second: 0},
      this.initDateRange[1], {hour: 23, minute: 59, second: 0}));
  }

  closeDatetimeRangePicker(): void {
    this.dateTimeRange.closeCollapse();
  }

  updateForRange(range: DatetimeRange): void {

    if (!range.equals(this.previousDateRange)) {
      this.previousDateRange = range;

      this.dataFetcherSvc.getTotalUsagePerDay(range.fromDate, range.toDate).subscribe(
        (data) => {

          if (data.isError) {
            console.error('Error in received week usage data.', data.value);
            this.updateChart([], []);
          } else {
            const newData = data.value.values.map(entry => entry.kwh);
            const newLabels = data.value.values.map(entry => this.timeFromToLabelStr(entry.timeFrom));
            this.updateChart(newData, newLabels, data.value.statistics);
          }
        },
        (error) => {
          this.updateChart([], []);
          // TODO: show error?
        }
      );
    }
  }

  private timeFromToLabelStr(timeFrom: string): string {
    // YYYY-MM-DDTHH:mm
    const date = moment(timeFrom, 'YYYY-MM-DDTHH:mm');
    return date.format('dd D/MM');
  }


  private updateChart(newData: number[], newLabels: string[], statistics: ApiStatistics = null): void {

    this.showChart = false;

    this.barChartLabels = newLabels;
    this.barChartData[0].data = newData;
    this.barChartOptions.scales.yAxes[0].ticks.suggestedMax = Math.max(...newData) + 5;

    if (statistics !== null && Math.max(...newData) > 0 && newData.length > 1) {
      this.avgLineOptions.value = statistics.totalAvg;
      this.avgLineOptions.label.content = 'Average: ' + statistics.totalAvg.toFixed(2) + ' kWh';
      this.workweekAvgLineOptions.value = statistics.weekdayAvg;
      this.workweekAvgLineOptions.label.content = 'Work week average: ' + statistics.weekdayAvg.toFixed(2) + ' kWh';

      if (statistics.totalAvg > 0) {
        this.barChartOptions.annotation.annotations.push(this.avgLineOptions);
      }
      if (statistics.weekdayAvg > 0 && statistics.weekdayAvg >= statistics.totalAvg + 0.1) {
        this.barChartOptions.annotation.annotations.push(this.workweekAvgLineOptions);
      }
    }
    else {
      this.barChartOptions.annotation.annotations = [];
    }

    // Hack to redraw the chart fully
    setTimeout(() => {
      this.showChart = true;
    }, 0);
  }


}
