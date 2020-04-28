import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit
} from '@angular/core';
import {
  ChartComponent
} from 'ng-apexcharts';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import {
  toNgbDate, COLORS
} from 'src/app/shared/global-functions';
import * as moment from 'moment';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import {
  ChartOptions
} from 'src/app/shared/interfaces/chart-options.model';
import { ShareButtonComponent } from 'src/app/shared/shared-components/share-button/share-button.component';



@Component({
  selector: 'app-today-line-chart',
  templateUrl: './today-line-chart.component.html',
  styleUrls: ['./today-line-chart.component.scss']
})
export class TodayLineChartComponent implements OnInit, AfterViewInit {

  @ViewChild('chartWrapper') chartWrapper: ElementRef;
  @ViewChild('chart') chart: ChartComponent;
  @ViewChild('shareBtn') shareComp: ShareButtonComponent;

  @Input() initialDateRange: NgbDate[] = [moment().subtract(2, 'months').startOf('day'), moment().subtract(2, 'months').endOf('day')].map(toNgbDate);
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
  public spinnerHeight = '291px';

  public chartOptions: Partial < ChartOptions > = {
    series: [{
      name: 'Today\'s total usage in Watts',
      data: []
    }],
    labels: [],
    noData: {
      text: 'Data is unavailable'
    },
    colors: [COLORS.$dark],
    chart: {
      type: 'area',
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
      curve: 'smooth',
      width: 2
    },

    title: {
      text: 'Today\'s total usage distribution',
      align: 'left',
      style: {
        fontWeight: 600,
        fontFamily: 'inherit'
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm'
        },
        datetimeUTC: false
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
        format: 'dd MMM yyyy @ HH:mm',
        formatter: (val, opts) => '<b>' + moment(val).format('DD MMM YYYY @ HH:mm') + '</b>',
      },
      y: {
        title: {
          formatter: (seriesName) => seriesName,
        },
        formatter: (value, opts) => {
          return '<b>' + value.toFixed(2) + '</b>';
        }
      },
      marker: {
        show: true,
      },
    }

  };


  constructor(
    private dataFetcherSvc: DataFetcherService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateChartSize();
    }, 10);
    setTimeout(() => {
      this.updateForRange(new DatetimeRange(this.initialDateRange[0], this.initialTimeRange[0],
        this.initialDateRange[1], this.initialTimeRange[1]));
    }, 50);
  }


  updateForRange(datetimeRange: DatetimeRange): void {
    this.isLoading = true;

    this.dataFetcherSvc.getTotalWattDistribution(datetimeRange.fromDate, datetimeRange.fromTime,
      datetimeRange.toDate, datetimeRange.toTime).subscribe(
      (data) => {
        const newData = data.value.map(d => d.value);
        const newLabels = data.value.map(d => d.dateMillis);

        this.updateChartData(newData, newLabels);
      },
      (error) => {
        this.updateChartData([], []);
      },
      () => this.isLoading = false
    );
  }


  onResize() {
    this.updateChartSize();
  }

  updateChartSize(): void {
    const newHeight = this.chartWrapper.nativeElement.clientHeight - 65;
    this.chartOptions.chart.height = newHeight;
    this.spinnerHeight = newHeight + 'px';
    this.chart.updateOptions(this.chartOptions);
  }

  updateChartData(newData, newLabels) {
    this.chartOptions.series = [{
      name: 'Today\'s total usage in Watts',
      data: newData
    }];
    this.chartOptions.labels = newLabels;
    this.chart.updateOptions(this.chartOptions);
  }

  shareChart(): void {
    if (!this.isLoading) {
      this.shareComp.shareChart(this.chart, new DatetimeRange(this.initialDateRange[0], this.initialTimeRange[0],
        this.initialDateRange[1], this.initialTimeRange[1]), 'Total usage in Watts');
    }
  }



}
