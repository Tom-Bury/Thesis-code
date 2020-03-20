import {
  Component,
  OnInit,
  Input,
  ViewChild
} from '@angular/core';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import {
  ChartOptions
} from 'src/app/shared/interfaces/chart-options.model';
import {
  ChartComponent
} from 'ng-apexcharts';

@Component({
  selector: 'app-per-fuse-stats',
  templateUrl: './per-fuse-stats.component.html',
  styleUrls: ['./per-fuse-stats.component.scss']
})
export class PerFuseStatsComponent implements OnInit {

  @Input() id = 1;
  public isOpened = false;
  public data: {
    fuse: string,
    kwh: number
  } [] = [];

  public chartOptions: Partial < ChartOptions > ;


  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        height: 350,
        type: 'donut'
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E']
    };
  }

  ngOnInit(): void {}

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
