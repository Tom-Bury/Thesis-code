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

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {}

  ngOnInit(): void {}

  fetchNewData(newRange: DatetimeRange): void {
    this.dataFetcherSvc.getTotalUsagePerDay(newRange.fromDate, newRange.toDate).subscribe(
      (data) => {
        if (!data.isError) {
          this.data = data.value.values.map(d => {
            return {
              date: this.transformDate(d.timeFrom),
              value: d.value
            };
          });
        } else {
          console.error('Received data error', data);
          this.data = [];
        }
      }
    );
  }

  getTotalSum(): string {
    return this.data.reduce((a, b) => a + b.value, 0).toFixed(3);
  }

  private transformDate(fromDateString: string): string {
    const date = moment(fromDateString, 'YYYY-MM-DDTHH:mm');
    return date.format('dd D MMM YYYY');
  }

}
