import { Component, OnInit, Input } from '@angular/core';
import { DataFetcherService } from 'src/app/shared/services/data-fetcher.service';
import { DatetimeRange } from 'src/app/shared/interfaces/datetime-range.model';

@Component({
  selector: 'app-per-fuse-stats',
  templateUrl: './per-fuse-stats.component.html',
  styleUrls: ['./per-fuse-stats.component.scss']
})
export class PerFuseStatsComponent implements OnInit {

  @Input() id = 1;
  public isOpened = false;
  public data: {fuse: string, kwh: number}[] = [];


  constructor(
    private dataFetcherSvc: DataFetcherService
  ) { }

  ngOnInit(): void {
  }

  fetchNewData(newRange: DatetimeRange): void {
    this.dataFetcherSvc.getFusesKwh(newRange.fromDate, newRange.fromTime, newRange.toDate, newRange.toTime).subscribe(
      (data) => {
        if (!data.isError) {
          this.data = Object.entries(data.value.values).map(d => {
            return {
              fuse: d[0],
              kwh: d[1].toFixed(3)
            };
          });
        } else {
          console.error('Something wrong with the received data', data);
          this.data = [];
        }
      },
      (error) => {
        console.error(error);
        this.data = [];
      }
    );
  }


}
