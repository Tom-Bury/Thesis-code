import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ChartComponent
} from 'ng-apexcharts';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  toNgbDate
} from 'src/app/shared/global-functions';
import { DatetimeRange } from 'src/app/shared/interfaces/datetime-range.model';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
}


@Component({
  selector: 'app-fuse-bar-chart',
  templateUrl: './fuse-bar-chart.component.html',
  styleUrls: ['./fuse-bar-chart.component.scss']
})
export class FuseBarChartComponent implements OnInit, AfterViewInit {

  @ViewChild('chart') chart: ChartComponent;

  public initialDateRange: NgbDate[] = [moment().startOf('day'), moment().endOf('day')].map(toNgbDate);
  public initialTimeRange: NgbTimeStruct[] = [{
    hour: 0,
    minute: 0,
    second: 0
  }, {
    hour: 23,
    minute: 59,
    second: 0
  }];
  public isLoading = true;

  public chartOptions = {
    series: [{
      name: '',
      data: []
    }, ],
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    xaxis: {
      type: 'category',
      categories: []
    },
    legend: {
      position: 'bottom',
    },
    fill: {
      opacity: 1
    }
  };

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.onDatetimeRangeSelected(new DatetimeRange(this.initialDateRange[0],
      this.initialTimeRange[0], this.initialDateRange[1], this.initialTimeRange[1]));
  }

  onDatetimeRangeSelected(newRange: DatetimeRange): void {
    this.isLoading = true;
    this.dataFetcherSvc.getFuseKwhPerInterval('hour', newRange.fromDate, newRange.fromTime,
      newRange.toDate, newRange.toTime).subscribe(
      (data) => {
        if (!data.isError) {


          const timeRanges = data.value.map(d => {
            return {
              from: d.timeFrom,
              to: d.timeTo
            };
          });
          const allFuseNames = [];
          const fuseValues = {};
          data.value.forEach(d => d.fuses.forEach(f => {
            if (!fuseValues[f.fuse]) {
              allFuseNames.push(f.fuse);
              fuseValues[f.fuse] = [];
            }
          }));

          let i = 0;
          data.value.forEach(d => {
            i += 1;
            d.fuses.forEach(f => {
              fuseValues[f.fuse].push(f.kwh);
            });

            allFuseNames.forEach(fn => {
              if (fuseValues[fn].length < i) {
                fuseValues[fn].push(0);
              }
            });
          });


          this.updateChart(allFuseNames, fuseValues, timeRanges.map(t => t.from));
        } else {
          console.error('Data error', data);
        }
      }, (error) => console.error(error),
      () => this.isLoading = false
    );
  }

  updateChart(names: string[], data: any, dates: string[]): void {

    this.chartOptions.xaxis = {
      type: 'category',
      categories: dates
    };

    setTimeout(() => {
      this.chartOptions.series = names.map(n => {
        return {
          name: n,
          data: data[n]
        };
      });
    }, 10);



  }

}
