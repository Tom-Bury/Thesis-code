import {
  Component,
  OnInit,
  Input,
  ViewChild
} from '@angular/core';
import {
  NgbDate
} from '@ng-bootstrap/ng-bootstrap';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexTooltip,
  ChartComponent,
  ApexNoData,
  ApexPlotOptions
} from 'ng-apexcharts';
import * as moment from 'moment';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  noData: ApexNoData;
  plotOptions: ApexPlotOptions;
}

@Component({
  selector: 'app-candlestick-stats',
  templateUrl: './candlestick-stats.component.html',
  styleUrls: ['./candlestick-stats.component.scss']
})
export class CandlestickStatsComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial < ChartOptions > ;

  @Input() initDateRange: NgbDate[] = [];


  constructor() {
    this.chartOptions = {
      series: [{
        name: 'candle',
        data: [{
            x: new Date(1538778600000),
            y: [20, 40, 10, 30]
            // y: [open, MAX, MIN, close] ===     |- x ->      min|-------[open     close]--|max
          },
          {
            x: new Date(1538778600000),
            y: [22, 30, 5, 25]
            // y: [open, MAX, MIN, close] ===     |- x ->      min|-------[open     close]--|max
          },
          {
            x: new Date(1538778600000),
            y: [30, 42, 20, 40]
            // y: [open, MAX, MIN, close] ===     |- x ->      min|-------[open     close]--|max
          },
        ]
      }],
      chart: {
        height: 350,
        type: 'candlestick',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#00B746',
            downward: '#EF403C'
          },
          wick: {
            useFillColor: false
          }
        }
      },
      noData: {
        text: 'Data is unavailable'
      },

      title: {
        text: 'CandleStick Chart - Category X-axis',
        align: 'left'
      },
      tooltip: {
        enabled: true
      },
      xaxis: {
        type: 'category',
        labels: {
          formatter: (val) => {
            return moment(val).format('MMM DD HH:mm');
          }
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };
  }

  ngOnInit(): void {}

}
