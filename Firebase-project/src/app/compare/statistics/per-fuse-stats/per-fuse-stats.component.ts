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

   @ViewChild('barChart') barChart: ChartComponent;

  @Input() id = 1;
  public isOpened = false;
  public data: {
    fuse: string,
    kwh: number
  } [] = [];

  public pieChartOptions: Partial < ChartOptions > ;
  public barChartOptions: Partial < ChartOptions > ;

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    this.pieChartOptions = {
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
          formatter: (val, { series, seriesIndex, dataPointIndex, w }) => {
            return '<b>' + val + '</b>';
          },
        },
        y: {
          title: {
            formatter: (seriesName) => seriesName
          },
          formatter: (value, {
            series,
            seriesIndex,
            dataPointIndex,
            w
          }) => {
            return '<b>' + value + ' kWhs</b>';
          }
        },
        marker: {
          show: true,
        },
      }
    };

    this.barChartOptions = {
      series: [{
        name: 'Total usage per circuit',
        data: []
      }],
      chart: {
        height: 500,
        type: 'bar',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      grid: {
        row: {
          colors: ['#fff', '#f8f9fa']
        }
      },
      legend: {
        show: false
      },
      noData: {
        text: 'Data is unavailable.'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        formatter: (val) => {
          return val.toFixed(1) + ' kWh';
        },
        style: {
          fontSize: '12px',
          colors: ['#212529']
        },
        textAnchor: 'start',
        offsetX: 5
      },
      xaxis: {
        categories: [],
        title: {
          text: '',
          style: {
            fontWeight: 600
          }
        },
        tickPlacement: 'between',
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        title: {
          text: 'kWhs',
          style: {
            fontWeight: 600
          }
        },
        axisTicks: {
          show: true
        },
        labels: {
          formatter: (val) => {
            return val.toString();
          }
        }
      },
      title: {
        text: 'Total usage per circuit',
        align: 'left',
        style: {
          fontWeight: 600,
          fontFamily: 'inherit'
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
          formatter: (val, { series, seriesIndex, dataPointIndex, w }) => {
            return '<b>Total usage per circuit</b>';
          },
        },
        y: {
          title: {
            formatter: (seriesName) => ''
          },
          formatter: (value, {
            series,
            seriesIndex,
            dataPointIndex,
            w
          }) => {
            return this.data.map(d => d.fuse)[seriesIndex].replace(/ SC/g, ' stopcontacten').replace(/SC/g, 'Stopcontacten') + ': <b>' + value + ' kWh</b>';
          }
        },
        marker: {
          show: true,
        },
      }
    };
  }

  ngOnInit(): void {}

  fetchNewData(newRange: DatetimeRange): void {
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
        }
      },
      (error) => {
        console.error(error);
        this.data = [];
      },
      () => {
        this.updatePieChart();
        this.updateBarChart();
      }
    );
  }

  private updatePieChart(percentage = 0.8): void {

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

      this.pieChartOptions.series = pieChartData.map(d => d.kwh);
      this.pieChartOptions.labels = pieChartData.map(d => d.fuse);
    } else {
      this.pieChartOptions.series = [];
      this.pieChartOptions.labels = [];
    }

  }


  private updateBarChart(): void {
    const newBarChartData = {
      name: 'Total usage per circuit',
      data: this.data.map(d => d.kwh)
    };
    this.barChartOptions.xaxis.categories = this.data.map(d => d.fuse);
    this.barChartOptions.series[0] = newBarChartData;

    this.barChart.updateOptions(this.barChartOptions);
  }

}
