import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import {
  NgbDate, NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexFill,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexNoData
} from 'ng-apexcharts';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import * as moment from 'moment';
import { toNgbDate } from 'src/app/shared/global-functions';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  noData: ApexNoData;
}


@Component({
  selector: 'app-category-bar-chart',
  templateUrl: './category-bar-chart.component.html',
  styleUrls: ['./category-bar-chart.component.scss']
})
export class CategoryBarChartComponent implements OnInit, AfterViewInit {


  private initDateRange: NgbDate[];
  private initTimeRange: NgbTimeStruct[];
  public isLoading = false;

  @ViewChild('chart') chart: ChartComponent;

  public chartOptions: Partial < ChartOptions > = {
    series: [{
      name: 'Today\'s total usage per category',
      type: 'bar',
      data: []
    }],
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    legend: {
      show: false,
      position: 'bottom'
    },
    noData: {
      text: 'Data is unavailable.'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top' // top, center, bottom
        }
      }
    },
    dataLabels: {
      enabled: false,
      enabledOnSeries: [0],
      formatter: (val) => {
        return val > 0 ? val.toFixed(2) : '';
      },
      offsetY: -15,
      style: {
        fontSize: '12px',
        colors: ['#212529']
      }
    },
    xaxis: {
      categories: [],
      tickPlacement: 'between',
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: true
      },
      labels: {
        formatter: (val) => {
          return val + ' kWh';
        }
      }
    },
    title: {
      text: 'Total usage per category',
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
        formatter: (val, opts) => '<b>' + val + '</b>',
      },
      y: [{
        formatter: (value, {
          series,
          seriesIndex,
          dataPointIndex,
          w
        }) => {
          return '<b>' + value.toFixed(2) + ' kWh</b>';

        }
      }, {
        formatter: (value, {
          series,
          seriesIndex,
          dataPointIndex,
          w
        }) => {
          return series[seriesIndex].length > 0 ? '<b>' + value.toFixed(2) + ' kWh</b>' : '';

        }
      }, {
        formatter: (value, {
          series,
          seriesIndex,
          dataPointIndex,
          w
        }) => {
          return series[seriesIndex].length > 0 ? '<b>' + value.toFixed(2) + ' kWh</b>' : '';

        }
      }],
      marker: {
        show: true,
      },
    }


  };

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {
    this.initDateRange = [moment().subtract(10, 'd').startOf('day'), moment().subtract(10, 'd').endOf('day')].map(toNgbDate);
    this.initTimeRange = [{
      hour: 0,
      minute: 0,
      second: 0
    }, {
      hour: 23,
      minute: 59,
      second: 0
    }];
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.updateChartSize();
      this.updateForRange(new DatetimeRange(this.initDateRange[0], this.initTimeRange[0],
        this.initDateRange[1], this.initTimeRange[1]));
    }, 10);
  }

  updateForRange(range: DatetimeRange): void {
    this.isLoading = true;
    this.dataFetcherSvc.getSensorsKwh(range.fromDate, range.fromTime, range.toDate, range.toTime).subscribe(
      (data) => {

        if (data.isError) {
          console.error('Error in received week usage data.', data.value);
          this.updateChartData([], []);
        } else {
          console.log(data);
          this.updateChartData([], []);

        }
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
    // this.chartOptions.chart.height = this.chartWrapper.nativeElement.clientHeight - 50;
    // this.chart.updateOptions(this.chartOptions);
  }

  updateChartData(newData: number[], labels: string[]) {
    this.chartOptions.xaxis = {
      categories: labels,
      axisBorder: {
        show: false
      },
      tickPlacement: 'between',
      tooltip: {
        enabled: false
      }
    };

    setTimeout(() => {
      const newSeries = [{
        name: 'Day total usage kWh',
        type: 'bar',
        data: newData
      }];

      this.chartOptions.series = newSeries;
    }, 1);
  }
}
