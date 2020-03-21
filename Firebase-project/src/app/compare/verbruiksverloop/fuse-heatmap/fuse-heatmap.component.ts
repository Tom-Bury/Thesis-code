import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ChartOptions
} from 'src/app/shared/interfaces/chart-options.model';

import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import { DatetimeRange } from 'src/app/shared/interfaces/datetime-range.model';

@Component({
  selector: 'app-fuse-heatmap',
  templateUrl: './fuse-heatmap.component.html',
  styleUrls: ['./fuse-heatmap.component.scss']
})
export class FuseHeatmapComponent implements OnInit {

  public chartOptions: Partial < ChartOptions > ;
  public isLoading = true;

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
        text: 'Usage distribution per circuit heatmap',
        align: 'left',
        style: {
          fontWeight: 600,
          fontFamily: 'inherit'
        }
      },
      xaxis: {
        title: {
          text: 'Date/time interval'
        },
        tooltip: {
          enabled: false
        },
      },
      yaxis: {
        title: {
          text: ''
        },
        labels: {
          formatter: (val, tickIndex) => {
            const label = val as unknown as string;
            const maxLabelLength = 18;
            if (label.length > 0) { // For some reason apexcharts has another extra empty series at the end...
              return label.substring(0, maxLabelLength) + (label.length >= maxLabelLength ? '...' : '');
            }
          }
        }
      },
      plotOptions: {
        heatmap: {
          radius: 2,
          enableShades: true,
          shadeIntensity: 1,
          reverseNegativeShade: true,
          distributed: false,
        }
      },
      tooltip: {
        enabled: true,
        followCursor: true,
        fillSeriesColor: false,
        theme: 'light',
        style: {
          fontSize: '12px',
          fontFamily: 'inherit'
        },
        onDatasetHover: {
          highlightDataSeries: true,
        },
        x: {
          show: true,
          formatter: (val, opts) => '<b>' + val + '</b>',
        },
        y: {
          title: {
            formatter: (seriesName) => seriesName,
          },
          formatter: (value, opts) => {
            return '<b>' + value + ' kWh</b>';
          }
        },
        marker: {
          show: true,
        },
      },
    };
  }

  ngOnInit(): void {}

  public updateForRange(newDatetimeRange: DatetimeRange, intervalAmount = 2, interval = 'hour'): void {
    this.isLoading = true;
    this.dataFetcherSvc.getFuseKwhPerInterval(
      interval, newDatetimeRange.fromDate, newDatetimeRange.fromTime,
      newDatetimeRange.toDate, newDatetimeRange.toTime, intervalAmount)
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
        this.isLoading = false;
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
