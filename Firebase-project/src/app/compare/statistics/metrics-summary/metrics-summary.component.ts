import { Component, OnInit, Input } from '@angular/core';
import { DatetimeRange } from 'src/app/shared/interfaces/datetime-range.model';
import { DataFetcherService } from 'src/app/shared/services/data-fetcher.service';

@Component({
  selector: 'app-metrics-summary',
  templateUrl: './metrics-summary.component.html',
  styleUrls: ['./metrics-summary.component.scss']
})
export class MetricsSummaryComponent implements OnInit {

  @Input() id = 1;
  public isOpened = false;

  // Statistic values
  public totalAvg;
  public weekdayAvg;

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) { }

  ngOnInit(): void {
  }

  fetchNewData(newRange: DatetimeRange): void {
    this.dataFetcherSvc.getTotalUsagePerDay(newRange.fromDate, newRange.toDate).subscribe(
      (data) => {
        console.log('METRIC', data);
        if (!data.isError) {
          this.totalAvg = data.value.statistics.totalAvg ? data.value.statistics.totalAvg.toFixed(3) : 0;
          this.weekdayAvg = data.value.statistics.weekdayAvg ? data.value.statistics.weekdayAvg.toFixed(3) : 0;
        } else {
          console.error('Received data error', data);
        }
      }
    );
  }


}
