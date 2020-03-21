import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {
  ChartOptions
} from 'src/app/shared/interfaces/chart-options.model';
import * as moment from 'moment';
import {
  toNgbDate
} from 'src/app/shared/global-functions';
import {
  NgbTimeStruct,
  NgbDate
} from '@ng-bootstrap/ng-bootstrap';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';

@Component({
  selector: 'app-fuse-heatmap',
  templateUrl: './fuse-heatmap.component.html',
  styleUrls: ['./fuse-heatmap.component.scss']
})
export class FuseHeatmapComponent implements OnInit, AfterViewInit {

  public chartOptions: Partial < ChartOptions > ;

  public testDateRange: NgbDate[] = [moment('03/03/2020', 'DD/MM/YYYY').startOf('day'),
    moment('03/03/2020', 'DD/MM/YYYY').endOf('day')
  ].map(toNgbDate);
  public testTimeRange: NgbTimeStruct[] = [{
    hour: 0,
    minute: 0,
    second: 0
  }, {
    hour: 23,
    minute: 59,
    second: 0
  }];

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    this.chartOptions = {
      series: [],
      chart: {
        height: 450,
        type: 'heatmap',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      noData: {
        text: 'Data is unavailable'
      },
      colors: ['#008FFB'],
      title: {
        text: 'Usage distribution heatmap',
        align: 'left',
        style: {
          fontWeight: 600,
          fontFamily: 'inherit'
        }
      },
      xaxis: {
        title: {
          text: 'Date/time interval'
        }
      },
      yaxis: {
        title: {
          text: 'Circuit'
        },
        labels: {
          formatter: (val, tickIndex) => {
            const label = val as unknown as string;
            const maxLabelLength = 20;
            if (label.length > 0) { // For some reason apexcharts has another extra empty series at the end...
              return label.substring(0, maxLabelLength) + (label.length >= maxLabelLength ? '...' : '');
            }
          }
        }
      },
    };
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataFetcherSvc.getFuseKwhPerInterval(
        'hour',
        this.testDateRange[0], this.testTimeRange[0],
        this.testDateRange[1], this.testTimeRange[1], 2)
      .subscribe(
        (data) => {
          if (!data.isError) {
            const fuseNames = data.value.allFuseNames;
            const intervals = data.value.intervals;
            const fuseKwhs = data.value.fuseKwhs;
            this.updateChart(fuseNames, fuseKwhs, intervals);
          } else {
            console.error('Received error from backend: ', data.value);
            this.updateChart([], [], []);
          }
        },
        (error) => {
          console.error(error);
          this.updateChart([], [], []);
        },
        () => {

        }
      );
  }


  private updateChart(fuseNames: string[], fusesData: any, timeLabels: {
    from: string,
    to: string
  } []): void {
    const newSeries = [];
    const dates = timeLabels.map(i => i.from.slice(i.from.indexOf('T') + 1) + ' to ' + i.to.slice(i.to.indexOf('T') + 1));
    fuseNames.forEach(fn => {
      const fuseData = fusesData[fn].map((kwh, i) => {
        return {
          x: dates[i],
          y: kwh
        }
      });
      newSeries.push({
        name: fn,
        data: fuseData
      });
    });
    this.chartOptions.series = newSeries;
  }

}
