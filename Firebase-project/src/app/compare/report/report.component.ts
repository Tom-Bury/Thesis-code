import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  DateTimeRangePickerComponent
} from 'src/app/shared/shared-components/date-time-range-picker/date-time-range-picker.component';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import * as moment from 'moment';
import {
  toNgbDate
} from 'src/app/shared/global-functions';
import {
  ApiStatistics
} from 'src/app/shared/interfaces/api-interfaces/api-statistics.model';
import {
  NgbDate
} from '@ng-bootstrap/ng-bootstrap';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  ApexStroke,
  ApexLegend,
  ApexTooltip,
  ApexGrid,
  ApexNoData
} from 'ng-apexcharts';





@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  private NB_CHARTS_LIMIT = 5;
  public initDateRanges: NgbDate[][];
  private currWeek = moment().day() === 0 ? [moment().day(-6), moment().day(0)].map(toNgbDate) :
  [moment().day(1), moment().day(7)].map(toNgbDate);


  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    this.initDateRanges = [this.currWeek];
   }

  ngOnInit(): void {}

  fabPressed(i: number): void {
    if (i === 0) {
      this.addBarChart();
    } else {
      this.removeBarChart();
    }
  }

  fab2Pressed(): void {
    this.removeBarChart();
  }

  addBarChart(): void {
    this.initDateRanges.push(this.currWeek);
  }

  removeBarChart(): void {
    this.initDateRanges.pop();
  }

  canAddChart(): boolean {
    return this.initDateRanges.length < this.NB_CHARTS_LIMIT;
  }

}
