import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';


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
              value: d.kwh
            };
          });
        } else {
          console.error('Received data error', data)
          this.data = [];
        }
      }
    );
  }

  private transformDate(fromDateString: string): string {
    return 'TODO';
  }

}
