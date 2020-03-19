import { Component, OnInit, Input } from '@angular/core';
import { DatetimeRange } from 'src/app/shared/interfaces/datetime-range.model';
import { DataFetcherService } from 'src/app/shared/services/data-fetcher.service';
import * as moment from 'moment';

@Component({
  selector: 'app-metrics-summary',
  templateUrl: './metrics-summary.component.html',
  styleUrls: ['./metrics-summary.component.scss']
})
export class MetricsSummaryComponent implements OnInit {

  @Input() id = 1;
  public isOpened = false;

  // Statistic values
  public totalAvg: string;
  public weekdayAvg: string;
  public maxDay: string;
  public maxVal: string;
  public minDay: string;
  public minVal: string;

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) { }

  ngOnInit(): void {
  }

  fetchNewData(newRange: DatetimeRange): void {
    this.dataFetcherSvc.getTotalUsagePerDay(newRange.fromDate, newRange.toDate).subscribe(
      (data) => {
        if (!data.isError) {
          const stats = data.value.statistics;
          this.totalAvg = stats.totalAvg ? stats.totalAvg.toFixed(3) : '0';
          this.weekdayAvg = stats.weekdayAvg ? stats.weekdayAvg.toFixed(3) : '0';
          this.maxDay = stats.max ? this.transformDate(stats.max.timeFrom) : 'no maximum';
          this.maxVal = stats.max ? stats.max.kwh.toFixed(3) : '0';
          this.minDay = stats.min ? this.transformDate(stats.min.timeFrom) : 'no minimum';
          this.minVal = stats.min ? stats.min.kwh.toFixed(3) : '0';
        } else {
          console.error('Received data error', data);
        }
      }
    );
  }


  private transformDate(fromDateString: string): string {
    const date = moment(fromDateString, 'YYYY-MM-DDTHH:mm');
    return date.format('dd D MMM YYYY');
  }

}
