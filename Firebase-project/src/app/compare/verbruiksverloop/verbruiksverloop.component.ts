import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  ChartDataSets,
  ChartOptions,
  Chart
} from 'chart.js';
import {
  Label,
  BaseChartDirective
} from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-verbruiksverloop',
  templateUrl: './verbruiksverloop.component.html',
  styleUrls: ['./verbruiksverloop.component.scss']
})
export class VerbruiksverloopComponent implements OnInit {

  chart: any;

  public showChart = true;

  public chartData: ChartDataSets[] = [{
    data: [65, 59, 80, 81, 56, 55, 40],
    label: 'Totale usage',
    backgroundColor: 'rgba(0,123,255,0.75)',
    borderColor: '#007bff',
    borderWidth: 2.5,
    hoverBorderWidth: 0,
    pointRadius: 0,
    pointBackgroundColor: '#007bff',
    pointBorderColor: '#007bff',
  }];
  public chartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public chartOptions: (ChartOptions) = {
    responsive: true,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 0,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    legend: {
      display: false,
      position: 'bottom'
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Total usage in Watt',
        },
        ticks: {
          padding: 4,
          min: 0,
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Date'
        },

      }]
    },
    tooltips: {
      position: 'nearest',
      intersect: false,
      backgroundColor: '#191919',
      titleFontStyle: 'bold',
      titleFontSize: 16,
      titleFontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Helvetica Neue\', Arial, sans-serif',
      bodyFontSize: 14,
      bodyFontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Helvetica Neue\', Arial, sans-serif',
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value, context) => {
          return value.toFixed(2) + ' kWh';
        },
        display: false
      },

    },

  };
  public lineChartType = 'line';
  public chartPlugins = [pluginDataLabels];

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
      draw: (ease) => {
        Chart.controllers.line.prototype.draw.call(this, ease);

        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
          const activePoint = this.chart.tooltip._active[0];
          const ctx = this.chart.ctx;
          const x = activePoint.tooltipPosition().x;
          const topY = this.chart.scales['y-axis-0'].top;
          const bottomY = this.chart.scales['y-axis-0'].bottom;

          // draw line
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#757575';
          ctx.stroke();
          ctx.restore();
        }
      }
    });
  }

  ngOnInit() {
    this.dataFetcherSvc.getTotalUsageDistribution().subscribe(
      (data) => {
        this.showChart = false;
        this.chartData[0].data = data.value.map(d => d.value);
        console.log(this.chartData[0].data);
        this.chartLabels = data.value.map(d => d.date);

        setTimeout(() => {
          this.showChart = true;
        }, 0);
      }
    );
  }

}
