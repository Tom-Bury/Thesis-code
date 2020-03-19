import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input
} from '@angular/core';

import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';

import {
  ChartComponent
} from 'ng-apexcharts';

import * as moment from 'moment';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import {
  toNgbDate
} from 'src/app/shared/global-functions';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, AfterViewInit {

  @ViewChild('chartWrapper') chartWrapper: ElementRef;
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
  public isLoading = false;
  public previousDatetimeRange: DatetimeRange;

  public chartOptions: Partial < ChartOptions > = {
    series: [{
      name: 'Total usage in Watts',
      data: []
    }],
    labels: [],
    noData: {
      text: 'Data is unavailable'
    },
    chart: {
      type: 'area',
      height: 450,
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
      curve: 'smooth'
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
        text: 'Total usage in Watts'
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
    private dataFetcherSvc: DataFetcherService) {}

  ngOnInit(): void {}



  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.updateChartSize();
      this.updateForRange(new DatetimeRange(this.initialDateRange[0], this.initialTimeRange[0],
        this.initialDateRange[1], this.initialTimeRange[1]));
    }, 10);
  }

  updateForRange(datetimeRange: DatetimeRange): void {
    if (!datetimeRange.equals(this.previousDatetimeRange)) {
      this.isLoading = true;
      this.previousDatetimeRange = datetimeRange;

      this.dataFetcherSvc.getTotalUsageDistribution(datetimeRange.fromDate, datetimeRange.fromTime,
        datetimeRange.toDate, datetimeRange.toTime).subscribe(
        (data) => {
          const newData = data.value.map(d => d.value);
          const newLabels = data.value.map(d => d.date);

          this.updateChartData(newData, newLabels);
        },
        (error) => {
          this.updateChartData([], []);
        },
        () => this.isLoading = false
      );
    }
  }


  onResize(event) {
    this.updateChartSize();
  }

  updateChartSize(): void {
    this.chartOptions.chart.height = this.chartWrapper.nativeElement.clientHeight - 50;
    this.chart.updateOptions(this.chartOptions);
  }

  updateChartData(data, labels) {
    this.chartOptions.series[0].data = data;
    this.chartOptions.labels = labels;
    this.chart.updateOptions(this.chartOptions);
  }


}
