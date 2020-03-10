import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { toNgbDate } from 'src/app/shared/global-functions';
import { ChartComponent } from 'ng-apexcharts';
import { DatetimeRange } from 'src/app/shared/interfaces/datetime-range.model';
import { ChartOptions } from '../verbruiksverloop/verbruiksverloop.component';

@Component({
  selector: 'app-vergelijk-duaal',
  templateUrl: './vergelijk-duaal.component.html',
  styleUrls: ['./vergelijk-duaal.component.scss']
})
export class VergelijkDuaalComponent implements OnInit {

  @ViewChild('chartWrapper') chartWrapper: ElementRef;
  @ViewChild('chart') chart: ChartComponent;

  public initialDateRange: NgbDate[] = [moment().startOf('day'), moment().endOf('day')].map(toNgbDate);
  public initialTimeRange: NgbTimeStruct[] = [{
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
      height: 300,
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

  constructor() { }

  ngOnInit(): void {
    this.initialDateRange = [toNgbDate(moment())];
  }

}
