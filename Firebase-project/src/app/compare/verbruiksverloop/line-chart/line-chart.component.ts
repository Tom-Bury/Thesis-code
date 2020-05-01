import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';

import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';

import {
  ChartComponent
} from 'ng-apexcharts';

import * as moment from 'moment';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import {
  ChartOptions
} from 'src/app/shared/interfaces/chart-options.model';
import { ShareButtonComponent } from 'src/app/shared/shared-components/share-button/share-button.component';
import { COLORS } from 'src/app/shared/global-functions';
import { HeatmapDataService } from '../heatmap-data.service';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @ViewChild('chartWrapper') chartWrapper: ElementRef;
  @ViewChild('chart') chart: ChartComponent;

  public isLoading = true;
  public chartOptions: Partial < ChartOptions > ;

  private currRange: DatetimeRange;

  private nbOfDatapoints = 0;

  constructor(
    private dataFetcherSvc: DataFetcherService,
    private heatmapDataSvc: HeatmapDataService
  ) {
    this.chartOptions = {
      series: [{
        name: 'Total usage in Watts',
        data: []
      }],
      labels: [],
      noData: {
        text: 'Data is unavailable'
      },
      colors: [COLORS.$dark],
      chart: {
        type: 'area',
        height: 400,
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: false // True: hide everything except graph line
        },
        toolbar: {
          show: false
        },
        fontFamily: 'Roboto, sans-serif',
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },

      title: {
        text: 'Total usage distribution',
        align: 'left',
        style: {
          fontWeight: 600,
          fontFamily: 'inherit'
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM \'yy',
            day: 'dd MMM',
            hour: 'HH:mm'
          }
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        title: {
          text: 'Total usage in Watts',
          style: {
            fontSize: '12px',
            fontFamily: '',
            fontWeight: 700,
            cssClass: '',
          },
        },
        decimalsInFloat: 0
      },
      legend: {
        show: false
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
          format: 'dd MMM yyyy @ HH:mm',
          formatter: (val, opts) => '<b>' + moment(val).format('DD MMM YYYY @ HH:mm') + '</b>',
        },
        y: {
          title: {
            formatter: (seriesName) => '',
          },
          formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
            const extraData = this.heatmapDataSvc.getData(dataPointIndex, this.nbOfDatapoints);
            const valueStr: string = value.toFixed(2);
            const totalUsageText: string = '<span>Total usage in Watts: <b style="font-weight: 700;">' + valueStr + ' Watts</b></span>';
            const maxCircuitText: string = extraData === '' ? '' : '<span>Max consuming circuit around this time (see heatmap):</span>' + '<span style="margin-left: 12px;"> ➡ ' + extraData + '</span>';
            const result = '<div class="d-flex flex-column" style="font-weight: 200;">'
            + totalUsageText
            + maxCircuitText +
            '</div>';
            return result;
          }
        },
        marker: {
          show: true,
        },
      }
    };

  }

  ngOnInit(): void {}

  public updateForRange(datetimeRange: DatetimeRange): void {
    this.isLoading = true;
    this.currRange = datetimeRange;

    this.dataFetcherSvc.getTotalWattDistribution(datetimeRange.fromDate, datetimeRange.fromTime,
      datetimeRange.toDate, datetimeRange.toTime).subscribe(
      (data) => {
        const newData = data.value.map(d => d.value);
        const newLabels = data.value.map(d => d.dateMillis);
        this.nbOfDatapoints = newData.length;
        this.updateChartData(newData, newLabels);
      },
      (error) => {
        this.updateChartData([], []);
      },
      () => this.isLoading = false
    );
  }


  // updateChartSize(): void {
  //   this.chartOptions.chart.height = this.chartWrapper.nativeElement.clientHeight - 50;
  //   this.chart.updateOptions(this.chartOptions);
  // }

  private updateChartData(newData: number[], newLabels) {
    if (newData.length > 0 && newLabels.length === newData.length && this.chart) {
      this.chartOptions.series = [{
        name: 'Total usage in Watts',
        data: newData
      }];
      this.chartOptions.labels = newLabels;
      this.chart.updateOptions(this.chartOptions);
    }
  }


  public shareChart(shareComp: ShareButtonComponent): void {
    shareComp.shareChart(this.chart, this.currRange, 'Total usage in Watts');
  }


}
