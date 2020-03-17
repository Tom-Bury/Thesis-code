import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexDataLabels, ApexYAxis, ApexTitleSubtitle, ApexLegend, ApexTooltip, ApexNoData, ChartComponent } from 'ng-apexcharts';
import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { toNgbDate } from 'src/app/shared/global-functions';
import * as moment from 'moment';
import { DataFetcherService } from 'src/app/shared/services/data-fetcher.service';
import { DatetimeRange } from 'src/app/shared/interfaces/datetime-range.model';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  noData: ApexNoData;
}



@Component({
  selector: 'app-today-line-chart',
  templateUrl: './today-line-chart.component.html',
  styleUrls: ['./today-line-chart.component.scss']
})
export class TodayLineChartComponent implements OnInit, AfterViewInit {

  @ViewChild('chartWrapper') chartWrapper: ElementRef;
  @ViewChild('chart') chart: ChartComponent;

  @Input() initialDateRange: NgbDate[] = [moment().subtract(7, 'day').startOf('day'), moment().subtract(7, 'day').endOf('day')].map(toNgbDate);
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
  public spinnerHeight = '300px';

  public chartOptions: Partial < ChartOptions > = {
    series: [{
      name: 'Today\'s total usage in Watts',
      data: []
    }],
    labels: [],
    noData: {
      text: 'Data is unavailable'
    },
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
      curve: 'smooth'
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
        }
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        text: 'Today\'s total usage in Watts'
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
    private dataFetcherSvc: DataFetcherService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateChartSize();
    }, 1);
    setTimeout(() => {
      this.updateForRange(new DatetimeRange(this.initialDateRange[0], this.initialTimeRange[0],
        this.initialDateRange[1], this.initialTimeRange[1]));
    }, 50);
  }


  updateForRange(datetimeRange: DatetimeRange): void {
      this.isLoading = true;

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


  onResize(event) {
    this.updateChartSize();
  }

  updateChartSize(): void {
    const newHeight = this.chartWrapper.nativeElement.clientHeight - 50;
    this.chartOptions.chart.height = newHeight;
    this.spinnerHeight = newHeight + 'px';
    this.chart.updateOptions(this.chartOptions);
  }

  updateChartData(data, labels) {
    this.chartOptions.series[0].data = data;
    this.chartOptions.labels = labels;
    this.chart.updateOptions(this.chartOptions);
  }

}
