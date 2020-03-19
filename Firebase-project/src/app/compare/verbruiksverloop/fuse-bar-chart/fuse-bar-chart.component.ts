import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input
} from '@angular/core';
import {
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
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';



@Component({
  selector: 'app-fuse-bar-chart',
  templateUrl: './fuse-bar-chart.component.html',
  styleUrls: ['./fuse-bar-chart.component.scss']
})
export class FuseBarChartComponent implements OnInit, AfterViewInit {

  @ViewChild('chart') chart: ChartComponent;

  @Input() initialDateRange: NgbDate[] = [moment().startOf('day'), moment().endOf('day')].map(toNgbDate);
  @Input() initialTimeRange: NgbTimeStruct[] = [{
    hour: 0,
    minute: 0,
    second: 0
  }, {
    hour: 23,
    minute: 59,
    second: 0
  }];
  public isLoading = true;

  public chartOptions: Partial<ChartOptions> = {
    series: [{
      name: '',
      data: []
    }, ],
    title: {
      text: 'Total used kWh per circuit per hour interval',
      align: 'left',
      style: {
        fontWeight: 600,
        fontFamily: 'inherit'
      }
    },
    noData: {
      text: 'Data is unavailable.'
    },
    chart: {
      type: 'bar',
      height: 600,
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      formatter: (val) => {
        return val >= 0.1 ? val.toFixed(2) : '';
      },
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    xaxis: {
      type: 'category',
      categories: [],
      labels: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: 'Total used kWh per interval'
      },
      labels: {
        formatter: (val) => {
          return val.toFixed(0);
        }
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
        formatter: (val, opts) => {
          return '<b>' + val.toFixed(2) + ' kWh</b>';
        }
      },
      marker: {
        show: true,
      },
    },
    legend: {
      position: 'bottom',
    },
    fill: {
      opacity: 1,
    },
    colors: ['#6d819c', '#00429d', '#93003a', '#2e59a8', '#cf3759', '#4771b2', '#f4777f', '#5d8abd', '#ffbcaf',
      '#73a2c6', '#8abccf', '#a5d5d8', '#c5eddf', '#ffdec7', '#ff9895', '#e4576b', '#b41648',
    ]
  };
  //https://vis4.net/palettes/#/16|d|00429d,96ffea,ffffe0|ffffe0,ff005e,93003a|1|1

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.updateForRange(new DatetimeRange(this.initialDateRange[0],
      this.initialTimeRange[0], this.initialDateRange[1], this.initialTimeRange[1]));
  }

  updateForRange(newRange: DatetimeRange): void {
    this.isLoading = true;
    this.dataFetcherSvc.getFuseKwhPerInterval('hour', newRange.fromDate, newRange.fromTime,
      newRange.toDate, newRange.toTime, 2).subscribe(
      (data) => {
        if (!data.isError) {
          const fuseNames = data.value.allFuseNames;
          const fuseKwhValues = data.value.fuseKwhs;
          const dates = data.value.intervals.map(i => i.from.slice(i.from.indexOf('T') + 1) + ' to ' + i.to.slice(i.to.indexOf('T') + 1));

          const sortedValues = [];

          // Sort the values
          for (let i = 0; i < dates.length; i++) {
            const currValues = fuseNames.map(name => {
              return {
                name,
                value: fuseKwhValues[name][i]
              }
            });
            currValues.sort((a, b) => b.value - a.value);
            sortedValues.push(currValues);
          }


          // Add back together
          const newData = {
            Others: []
          };
          fuseNames.forEach(name => newData[name] = []);

          sortedValues.forEach(sortedDate => {
            let sum = 0;
            sortedDate.forEach(({
              name,
              value
            }, i) => {
              if (i < 4) {
                newData[name].push(value);
              } else {
                sum += value;
                newData[name].push(0);
              }
            });
            newData.Others.push(sum);
          });

          // Remove all zero lists
          const finalData = {
            Others: newData.Others
          };
          fuseNames.forEach(name => {
            if (newData[name].some(v => v > 0)) {
              finalData[name] = newData[name];
            }
          });

          // Trim trailing zeroes
          let maxNbEls = 0;
          Object.keys(finalData).forEach(name => {
            while (finalData[name][finalData[name].length - 1] === 0) {
              finalData[name].pop();
            }
            maxNbEls = finalData[name].length > maxNbEls ? finalData[name].length : maxNbEls;
          });

          Object.keys(finalData).forEach(name => {
            while (finalData[name].length < maxNbEls) {
              finalData[name].push(0);
            }
          });

          this.updateChart(Object.keys(finalData), finalData, dates);
        } else {
          console.error('Data error', data);
        }
      }, (error) => console.error(error),
      () => {
        setTimeout(() => {
          this.isLoading = false;
        }, 1500);
      }
    );
  }

  updateChart(names: string[], data: any, dates: string[]): void {

    this.chartOptions.xaxis = {
      type: 'category',
      categories: dates,
      labels: {
        show: false
      }
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
