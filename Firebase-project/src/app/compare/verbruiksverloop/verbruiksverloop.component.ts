import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { toNgbDate } from 'src/app/shared/global-functions';
import { DatetimeRange } from 'src/app/shared/interfaces/datetime-range.model';
import * as moment from 'moment';
import { LineChartComponent } from './line-chart/line-chart.component';
import { FuseBarChartComponent } from './fuse-bar-chart/fuse-bar-chart.component';


@Component({
  selector: 'app-verbruiksverloop',
  templateUrl: './verbruiksverloop.component.html',
  styleUrls: ['./verbruiksverloop.component.scss']
})
export class VerbruiksverloopComponent implements OnInit {

  @ViewChild('lineChart') lineChart: LineChartComponent;
  @ViewChild('barChart') barChart: FuseBarChartComponent;

  public initialDateRange: NgbDate[] = [moment().startOf('day'), moment().endOf('day')].map(toNgbDate);
  public initialTimeRange: NgbTimeStruct[] = [{
    hour: 0,
    minute: 0,
    second: 0
  }, {
    hour: 23,
    minute: 59,
    second: 0
  }];
  public isLoading = false;
  public previousDatetimeRange: DatetimeRange;

  constructor() {}

  ngOnInit() {}

  updateForRange(newRange: DatetimeRange): void {
    this.lineChart.updateForRange(newRange);
    this.barChart.updateForRange(newRange);
  }
}
