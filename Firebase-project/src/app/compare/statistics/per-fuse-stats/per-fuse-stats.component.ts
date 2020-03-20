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
      series: [],
      chart: {
        height: 350,
        type: 'donut'
      },
      labels: [],
      noData: {
        text: 'Data is unavailable'
      }
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
              kwh: Math.round((d[1] + Number.EPSILON) * 100) / 100
            };
          });

          this.data.sort((a, b) => b.kwh - a.kwh);

        } else {
          console.error('Something wrong with the received data', data);
          this.data = [];
        }
      },
      (error) => {
        console.error(error);
        this.data = [];
      },
      () => {
        this.updateChart();
      }
    );
  }

  private updateChart(percentage = 0.8): void {

    const topPercentage = this.data.reduce((a, b) => a + b.kwh, 0) * percentage;
    const pieChartData = [];
    let currTotalKwh = 0;
    let restKwh = 0;
    this.data.forEach(d => {
      currTotalKwh += d.kwh;
      if (currTotalKwh <= topPercentage) {
        pieChartData.push(d);
      } else {
        restKwh += d.kwh;
      }
    });
    pieChartData.push({fuse: 'Others', kwh: Math.round((restKwh + Number.EPSILON) * 100) / 100});

    this.chartOptions.series = pieChartData.map(d => d.kwh);
    this.chartOptions.labels = pieChartData.map(d => d.fuse);
  }


}
