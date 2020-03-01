import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  ChartOptions,
  ChartType,
  ChartDataSets
} from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import {
  Label,
  BaseChartDirective
} from 'ng2-charts';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {


  private avgLineOptions = {
    drawTime: 'afterDraw',
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: 0,
    borderColor: '#dc3545',
    borderWidth: 4,
    label: {
      backgroundColor: '#dc3545',
      fontSize: 12,
      fontColor: '#fff',
      xPadding: 6,
      yPadding: 6,
      cornerRadius: 5,
      position: 'right',
      xAdjust: 10,
      yAdjust: -15,
      enabled: true,
      content: 'Average'
    },
  };

  public barChartOptions: (ChartOptions & {
    annotation: any
  }) = {
    responsive: true,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 500,
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
          labelString: 'Total kWh',
        },
        ticks: {
          padding: 4,
          min: 0,
          suggestedMax: 50,
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Day of current week'
        }
      }]
    },
    tooltips: {
      position: 'nearest',
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
          return value + ' kWh';
        },
        display: (context) => {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return value > 0;
        },
      },
    },

    annotation: {
      annotations: [this.avgLineOptions]
    },
  };

  public showChart = false;
  public barChartLabels: Label[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [pluginDataLabels, pluginAnnotations];

  public barChartData: ChartDataSets[] = [{
    data: [0, 0, 0, 0, 0, 0, 0],
    label: 'Total usage in kWh',
    backgroundColor: '#007bff',
    borderColor: '#180DFF',
    borderWidth: 0,
    hoverBackgroundColor: '#0C3CE8',
    hoverBorderColor: '#180DFF',
    hoverBorderWidth: 0,
  }, ];




  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {}

  ngOnInit(): void {
    this.dataFetcherSvc.getWeekUsage().subscribe(
      (data) => {
        let newData = [0, 0, 0, 0, 0, 0, 0];

        if (data.isError) {
          console.error('Error in received week usage data.', data.value);
        } else {
          newData = data.value.map(entry => entry.kwh);
        }

        this.updateChart(newData);
      },
      (error) => {
        const newData = [0, 0, 0, 0, 0, 0, 0];
        this.updateChart(newData);
      }
    )
  }



  private updateChart(newData): void {
    newData = newData;
    this.showChart = false;

    this.barChartData[0].data = newData;
    const avg = this.calcAvgWeekUsage(newData);
    this.avgLineOptions.value = avg;
    this.avgLineOptions.label.content = 'Average: ' + avg.toFixed(2) + ' kWh';
    this.barChartOptions.scales.yAxes[0].ticks.suggestedMax = Math.max(...newData) + 5;

    if (avg > 0) {
      this.barChartOptions.annotation.annotations = [this.avgLineOptions];
    }
    else {
      this.barChartOptions.annotation.annotations = [];
    }

    this.showChart = true;
  }

  private calcAvgWeekUsage(arr: number[]): number {
    const sum = arr.reduce((a, b) => a + b, 0);
    const nbNonZero = arr.filter(n => n > 0).length;
    return sum / nbNonZero;
  }


}
