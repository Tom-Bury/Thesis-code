import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';
import { ApexAxisChartSeries, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-progress-line-chart',
  templateUrl: './progress-line-chart.component.html',
  styleUrls: ['./progress-line-chart.component.scss']
})
export class ProgressLineChartComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent;


  // @Input() initialDateRange: NgbDate[] = [moment().startOf('day'), moment().endOf('day')].map(toNgbDate);
  // @Input() initialTimeRange: NgbTimeStruct[] = [{
  //   hour: 0,
  //   minute: 0,
  //   second: 0
  // }, {
  //   hour: 23,
  //   minute: 59,
  //   second: 0
  // }];

  public isLoading = false;
  public spinnerHeight = '291px';
  private labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  public chartOptions: Partial < ChartOptions > = {
    series: [{
      name: 'You',
      type: 'line',
      data: [10, 15, 17, 5, 7]
    }],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    noData: {
      text: 'Data is unavailable'
    },
    chart: {
      type: 'line',
      height: '300',
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: false // True: hide everything except graph line
      },
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      width: 4
    },
    markers: {
      size: 5,
      hover: {
        size: 10
      }
    },
    title: {
      text: 'Energy you saved via checklist actions',
      align: 'left',
      style: {
        fontWeight: 600,
        fontFamily: 'inherit'
      }
    },
    xaxis: {
      type: 'category',
      labels: {
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
        text: 'Amount of energy in Wh',
        style: {
            fontSize: '12px',
            fontFamily: '',
            fontWeight: 550,
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
        formatter: (val, { series, seriesIndex, dataPointIndex, w }) => '<b>' + this.labels[dataPointIndex] + '</b>',
      },
      y: {
        title: {
          formatter: (seriesName) => '<b>' + seriesName + '</b>',
        },
        formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
          return series[0][dataPointIndex] + ' Whs saved';
        }
      },
      marker: {
        show: false,
      },
    }

  };


  constructor() { }

  ngOnInit(): void {
  }



  public addRandomData(label: string): void {
    const newChartSeries: ApexAxisChartSeries = [];
    const ogData = (this.chartOptions.series[0] as any).data;
    newChartSeries.push({
      name: 'you',
      type: 'line',
      data: ogData
    });
    const newData = {
      name: label,
      type: 'line',
      data: this.getRandomArray(5, 0, 20)
    };
    newChartSeries.push(newData);
    this.chart.updateSeries(newChartSeries);
  }

  public removeRandomData(): void {
    const newChartSeries: ApexAxisChartSeries = [];
    const ogData = (this.chartOptions.series[0] as any).data;
    newChartSeries.push({
      name: 'You',
      type: 'line',
      data: ogData
    });
    this.chart.updateSeries(newChartSeries);
  }

  private getRandomArray(length: number, min: number, max: number): number[] {
    const result = [];
    while (result.length < length) {
      let r = Math.random() * max;
      r = r < min ? r + min : r;
      const randomNb = Math.floor(r);
      result.push(randomNb);
    }
    return result;
  }

}
