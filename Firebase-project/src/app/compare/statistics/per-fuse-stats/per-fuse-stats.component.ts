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
import { COLORS } from 'src/app/shared/global-functions';

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
  public isLoading = true;

  public percentageChartOptions: Partial < ChartOptions > ;
  public barChartOptions: Partial < ChartOptions > ;

  private percentages: number[] = [];
  private currDatetimeRange: DatetimeRange = null;

  // private barColors = ['#008FFB',	'#00E396',	'#FEB019',	'#FF4560',	'#775DD0', '#546E7A'];
  // private percentageColors = ['#008FFB',	'#00E396',	'#FEB019',	'#FF4560',	'#775DD0', '#546E7A'].reverse();
  private barColors = [COLORS.$dark,	COLORS.$success,	COLORS.$warning,	COLORS.$danger,	COLORS.$info, COLORS.$gray];
  private percentageColors = [COLORS.$dark,	COLORS.$success,	COLORS.$warning,	COLORS.$danger,	COLORS.$info, COLORS.$gray].reverse();
  private showTopN = 5;
  private othersColor =  COLORS.$gray;

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    this.percentageChartOptions = {
      series: [],
      chart: {
        height: 500,
        type: 'bar',
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: false
        },
        fontFamily: 'Roboto, sans-serif',
      },
      title: {
        text: 'Top 5 circuits percentage of total used energy',
        align: 'left',
        style: {
          fontWeight: 600,
          fontFamily: 'inherit'
        }
      },
      noData: {
        text: 'Data is unavailable.'
      },
      colors: this.percentageColors,
      labels: [],
      xaxis: {
        title: {
          text: '',
          style: {
            fontWeight: 600
          }
        },
        axisTicks: {
          show: false
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
        opposite: true,
        title: {
          text: 'Percentage of total energy used',
          style: {
            fontSize: '12px',
            fontFamily: '',
            fontWeight: 700,
            cssClass: '',
          },
        },
        axisTicks: {
          show: true
        },
        labels: {
          formatter: (val) => {
            return val.toFixed(0) + '%';
          }
        }
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
          fontSize: '0.8rem',
          fontFamily: 'inherit'
        },
        onDatasetHover: {
          highlightDataSeries: true,
        },
        x: {
          show: true,
          formatter: (val, {
            series,
            seriesIndex,
            dataPointIndex,
            w
          }) => {
            return '<b>' + 'Percentage of total used energy from ' + this.currDatetimeRange.toPrettyString() + '</b>';
          },
        },
        y: {
          title: {
            formatter: (seriesName) => seriesName.replace(/ SC/g, ' stopcontacten').replace(/SC/g, 'Stopcontacten')
          },
          formatter: (value, {
            series,
            seriesIndex,
            dataPointIndex,
            w
          }) => {
            return '<b>' + value + ' kWhs</b> = <b>' + this.percentages[seriesIndex] + '%</b>';
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
        },
        fontFamily: 'Roboto, sans-serif',
      },
      noData: {
        text: 'Data is unavailable.'
      },
      grid: {
        row: {
          colors: ['#fff']
        }
      },
      legend: {
        show: false
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => {
          return val.toFixed(1) + ' kWh';
        },
        style: {
          fontSize: '12px',
          colors: ['#212529']
        },
        textAnchor: 'start',
        offsetX: 10
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
        },
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        title: {
          text: 'kWhs',
          style: {
            fontSize: '12px',
            fontFamily: '',
            fontWeight: 700,
            cssClass: '',
          },
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
      colors: this.barColors,
      tooltip: {
        enabled: true,
        followCursor: true,
        fillSeriesColor: false,
        theme: 'light',
        style: {
          fontSize: '0.8rem',
          fontFamily: 'inherit'
        },
        onDatasetHover: {
          highlightDataSeries: true,
        },
        x: {
          show: true,
          formatter: (val, {
            series,
            seriesIndex,
            dataPointIndex,
            w
          }) => {
            return '<b>Total usage per circuit from ' + this.currDatetimeRange.toPrettyString() + '</b>';
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
            return '<b>' + value + ' kWh</b>';
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
    this.isLoading = true;
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
          this.currDatetimeRange = newRange;
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
        this.updatePercentageChart(this.showTopN);
        this.updateBarChart();
        this.isLoading = false;
      }
    );
  }

  private updatePercentageChart(topN = 5): void {

    if (this.data.length > 0) {
      const sorted = this.data.sort((a, b) => b.kwh - a.kwh);
      const chartData = [];
      let othersKwh = 0;
      let i = 0;

      sorted.forEach(circuit => {
        if (i < topN) {
          chartData.push({
            name: circuit.fuse,
            data: [this.roundNb(circuit.kwh)]
          });
        } else {
          othersKwh += circuit.kwh;
        }
        i++;
      });

      chartData.push({
        name: 'Others',
        data: [this.roundNb(othersKwh)]
      });
      this.setPercentages(chartData);
      this.percentageChartOptions.series = chartData.reverse();
      this.percentageChartOptions.labels = [''];
    } else {
      this.percentageChartOptions.series = [];
      this.percentageChartOptions.labels = [];
    }
  }

  private setPercentages(percentageChartData: {
    name: string,
    data: number[]
  } []): void {
    let totalKwh = 0;
    percentageChartData.forEach(d => totalKwh += d.data[0]);
    this.percentages = [];
    percentageChartData.forEach(d => {
      const currPercentage = this.roundNb(100 * d.data[0] / totalKwh);
      this.percentages.push(currPercentage);
    });
    this.percentages = this.percentages.reverse();
  }


  private updateBarChart(): void {
    const values = this.data.map(d => d.kwh);
    const newBarChartData = {
      name: 'Total usage per circuit',
      data: values
    };
    this.barChartOptions.xaxis.categories = this.data.map(d => d.fuse);
    this.barChartOptions.series[0] = newBarChartData;
    this.barChartOptions.xaxis.max = Math.max(...values) + 3;
    const cols = this.barColors;
    while (cols.length < values.length) {
      cols.push(this.othersColor);
    }
    this.barChartOptions.colors = cols;
    this.barChart.updateOptions(this.barChartOptions);
  }

  private roundNb(nb: number, decimalPoint = 2): number {
    const factor = 10 ** decimalPoint;
    return Math.round((nb + Number.EPSILON) * factor) / factor;
  }
}
