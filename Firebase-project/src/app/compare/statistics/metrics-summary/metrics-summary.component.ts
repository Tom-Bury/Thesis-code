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

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) { }

  ngOnInit(): void {
  }

  fetchNewData(newRange: DatetimeRange): void {
    this.dataFetcherSvc.getTotalUsagePerDay(newRange.fromDate, newRange.toDate).subscribe(
      (data) => {
        if (!data.isError) {
          console.log(data);
        } else {
          console.error('Received data error', data);
        }
      }
    );
  }


}
