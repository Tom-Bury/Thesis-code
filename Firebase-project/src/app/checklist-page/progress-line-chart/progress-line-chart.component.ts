import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';

@Component({
  selector: 'app-progress-line-chart',
  templateUrl: './progress-line-chart.component.html',
  styleUrls: ['./progress-line-chart.component.scss']
})
export class ProgressLineChartComponent implements OnInit {


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

  public chartOptions: Partial < ChartOptions > = {
    series: [{
      name: 'Energy you saved via checklist actions',
      data: [10, 14, 9, 5, 12]
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
        text: 'Amount of energy in kWh',
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
        formatter: (val, opts) => '<b>' + val + '</b>',
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
  }

}
