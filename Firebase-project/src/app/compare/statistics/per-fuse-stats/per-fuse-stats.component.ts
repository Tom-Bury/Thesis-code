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
  public dataIsUnavailable = false;


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
      },
      legend: {
        position: 'bottom'
      }
    };
  }

  ngOnInit(): void {}

  fetchNewData(newRange: DatetimeRange): void {
    this.dataIsUnavailable = false;
    this.dataFetcherSvc.getFusesKwh(newRange.fromDate, newRange.fromTime, newRange.toDate, newRange.toTime).subscribe(
      (data) => {
        if (!data.isError) {
          this.data = Object.entries(data.value.values).map(d => {
            const fuseName = d[0];
            const fusekWh = d[1] as number;
            return {
              fuse: fuseName,
              kwh: Math.round((fusekWh + Number.EPSILON) * 100) / 100
            };
          });

          this.data.sort((a, b) => b.kwh - a.kwh);
        } else {
          console.error('Something wrong with the received data', data);
          this.data = [];
          this.dataIsUnavailable = true;
        }
      },
      (error) => {
        console.error(error);
        this.data = [];
        this.dataIsUnavailable = true;
      },
      () => {
        this.updateChart();
      }
    );
  }

  private updateChart(percentage = 0.8): void {

    if (this.data.length > 0) {
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
    } else {
      this.chartOptions.series = [];
      this.chartOptions.labels = [];
    }

  }


}
