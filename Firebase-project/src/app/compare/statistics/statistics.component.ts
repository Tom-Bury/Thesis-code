import {
  Component,
  OnInit,
  Input,
  ViewChild,
} from '@angular/core';
import { DatetimeRange } from 'src/app/shared/interfaces/datetime-range.model';
import { DayByDayStatsComponent } from './day-by-day-stats/day-by-day-stats.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  @ViewChild('dayByDay1') dbd1: DayByDayStatsComponent;
  @ViewChild('dayByDay2') dbd2: DayByDayStatsComponent;

  @Input() currRange: DatetimeRange;
  public isOpened: boolean[] = [false];

  constructor() {}

  ngOnInit(): void {}

  datetimeRangeSelected(newRange: DatetimeRange): void {
    if (!newRange.equals(this.currRange)) {
      this.currRange = newRange;
      this.dbd1.fetchNewData(newRange);
      this.dbd2.fetchNewData(newRange);

    }
  }
}
