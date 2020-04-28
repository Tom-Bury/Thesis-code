import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ChartOptions
} from 'src/app/shared/interfaces/chart-options.model';

import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import {
  ShareButtonComponent
} from 'src/app/shared/shared-components/share-button/share-button.component';
import {
  ChartComponent,
  ApexAxisChartSeries
} from 'ng-apexcharts';
import { COLORS } from 'src/app/shared/global-functions';

@Component({
  selector: 'app-fuse-heatmap',
  templateUrl: './fuse-heatmap.component.html',
  styleUrls: ['./fuse-heatmap.component.scss']
})
export class FuseHeatmapComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent;

  public chartOptions: Partial < ChartOptions > ;
  public isLoading = true;

  private currRange: DatetimeRange;
  public allLabels: {
    label: string,
    cleanerName: string
  } [] = [];
  private allData: ApexAxisChartSeries;
  private currentlyActiveData: ApexAxisChartSeries;
  public currLabelsStatus: any;


  public tooltipShown = false;
  public tooltipTitle = '';
  public tooltipTextValue = '';
  public tooltipTextTimerange = '';

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
      colors: [COLORS.$dark],
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
            const maxLabelLength = 20;
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
        theme: 'dark',
        style: {
          fontSize: '12px',
          fontFamily: 'inherit'
        },
        onDatasetHover: {
          highlightDataSeries: true,
        },
        custom: ({
          series,
          seriesIndex,
          dataPointIndex,
          w
        }) => {
          return '<div id="ttdummy" style="width: 0; height: 0;">' + seriesIndex + '$$$' + dataPointIndex + '</div>';
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
          show: false,
        },
      },
    };
  }

  ngOnInit(): void {}

  public updateForRange(newDatetimeRange: DatetimeRange): void {
    this.isLoading = true;
    this.currRange = newDatetimeRange;

    const timeDifference = newDatetimeRange.timeBetweenInSeconds();
    let intervalAmount = 1;
    let interval = 'hour';

    if (timeDifference <= 86400) {
      intervalAmount = 1;
      interval = 'hour';
    } else if (timeDifference <= 172800) {
      intervalAmount = 2;
      interval = 'hour';
    } else if (timeDifference <= 604800) {
      intervalAmount = 6;
      interval = 'hour';
    } else {
      intervalAmount = 1;
      interval = 'day';
    }

    this.dataFetcherSvc.getFuseKwhPerInterval(
        interval, newDatetimeRange.fromDate, newDatetimeRange.fromTime,
        newDatetimeRange.toDate, newDatetimeRange.toTime, intervalAmount)
      .subscribe(
        (data) => {
          if (!data.isError) {
            const fuseNames = Object.keys(data.value.fusesResults);
            const intervals = data.value.timeframes;
            const fuseKwhs = data.value.fusesResults;
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
    timeFrom: string,
    timeTo: string
  } []): void {
    const newSeries = [];
    const dates = timeLabels.map(i => i.timeFrom.slice(i.timeFrom.indexOf('T') + 1, i.timeFrom.indexOf('T') + 6) + ' to ' + i.timeTo.slice(i.timeTo.indexOf('T') + 1, i.timeTo.indexOf('T') + 6));

    // Remove unnecessary trailing zeros (but not zeros where other fuses do have a value!)
    let maxNbNotAllZeroVals = 0;
    fuseNames.forEach(fn => {
      const dataNoTrailingZero = fusesData[fn];
      while (dataNoTrailingZero[dataNoTrailingZero.length - 1] === 0) { // While the last element is a 0,
        dataNoTrailingZero.pop(); // Remove that last element
      }
      fusesData[fn] = dataNoTrailingZero;
      maxNbNotAllZeroVals = dataNoTrailingZero.length > maxNbNotAllZeroVals ? dataNoTrailingZero.length : maxNbNotAllZeroVals;
    });

    // So here, add back zeros for fuses that just were 0
    fuseNames.forEach(fn => {
      const data = fusesData[fn];

      while (data.length < maxNbNotAllZeroVals) {
        data.push(0);
      }

      fusesData[fn] = data;
    });


    this.currLabelsStatus = {};

    fuseNames.forEach(fn => {
      this.currLabelsStatus[fn] = true;

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
    this.currentlyActiveData = newSeries;
    this.allData = newSeries;
    this.allLabels = fuseNames.reverse().map(label => {
      return {
        label,
        cleanerName: label.replace(/ SC/g, ' stopcontacten').replace(/SC/g, 'Stopcontacten')
      };
    });

    setTimeout(() => {
      this.linkDummy();
    }, 200);
  }


  // Hacky solution for sticky tooltip
  public linkDummy(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutationRecord) => {
        const classes = (mutationRecord.target as any).className.split(' ');

        if (classes.includes('apexcharts-active')) {
          const dummyData = document.getElementById('ttdummy').innerText.split('$$$');
          const seriesIndex = parseInt(dummyData[0], 10);
          const dataPointIndex = parseInt(dummyData[1], 10);
          const dataPoint = (this.currentlyActiveData[seriesIndex].data[dataPointIndex] as any);
          this.tooltipTitle = this.currentlyActiveData[seriesIndex].name.replace(/ SC/g, ' stopcontacten').replace(/SC/g, 'Stopcontacten');
          this.tooltipTextTimerange = dataPoint.x;
          this.tooltipTextValue = dataPoint.y;
          this.tooltipShown = true;
        } else {
          // Sadly we don't notice that apexcharts-active class leaves
          // --> So add div around chart & set tooltipShown to false on mouseleave there
          this.tooltipShown = false;
        }
      });
    });

    const target = document.getElementsByClassName('apexcharts-theme-dark').item(0);
    if (target) {
      observer.observe(target, {
        attributes: true,
        attributeFilter: ['style']
      });
    }
  }

  public toggleCircuit(circuit: string): void {
    this.currLabelsStatus[circuit] = !this.currLabelsStatus[circuit];
    this.updateChartForLabels();
  }

  public selectNone(): void {
    this.allLabels.forEach(l => this.currLabelsStatus[l.label] = false);
    this.updateChartForLabels();
  }

  public selectAll(): void {
    this.allLabels.forEach(l => this.currLabelsStatus[l.label] = true);
    this.updateChartForLabels();
  }


  private updateChartForLabels(): void {
    const newData = [];
    this.allData.forEach(d => {
      if (this.currLabelsStatus[d.name]) {
        newData.push(d);
      }
    });
    this.chartOptions.series = newData;
    this.currentlyActiveData = newData;

    // Need to reactivate tooltip listener
    setTimeout(() => {
      this.linkDummy();
    }, 100);
  }

  public shareChart(shareComp: ShareButtonComponent): void {
    shareComp.shareChart(this.chart, this.currRange, 'Usage distribution per circuit heatmap');
  }

}
