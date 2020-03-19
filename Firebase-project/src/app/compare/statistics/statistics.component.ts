import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { DatetimeRange } from 'src/app/shared/interfaces/datetime-range.model';
import { DayByDayStatsComponent } from './day-by-day-stats/day-by-day-stats.component';
import * as moment from 'moment';
import { toNgbDate } from 'src/app/shared/global-functions';
import { MetricsSummaryComponent } from './metrics-summary/metrics-summary.component';
import { PerFuseStatsComponent } from './per-fuse-stats/per-fuse-stats.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit {

  @ViewChild('dayByDay') dbd: DayByDayStatsComponent;
  @ViewChild('metrics') metrics: MetricsSummaryComponent;
  @ViewChild('perFuseStats') perFuseStats: PerFuseStatsComponent;

  @Input() currRange: DatetimeRange;
  public isOpened: boolean[] = [false];

  constructor() {
    this.currRange = new DatetimeRange(
      toNgbDate(moment().subtract(14, 'day').startOf('week')),
      {hour: 0, minute: 0, second: 0},
      toNgbDate(moment().subtract(14, 'day').endOf('week')),
      {hour: 0, minute: 0, second: 0},
    );
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.datetimeRangeSelected(this.currRange, true);
  }


  datetimeRangeSelected(newRange: DatetimeRange, initialCall = false): void {
    if (!newRange.equals(this.currRange) || initialCall) {
      this.currRange = newRange;
      this.dbd.fetchNewData(newRange);
      this.metrics.fetchNewData(newRange);
      this.perFuseStats.fetchNewData(newRange);
    }
  }
}
