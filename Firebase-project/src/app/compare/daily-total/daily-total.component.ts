import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
} from '@angular/core';

import * as moment from 'moment';
import {
  toNgbDate, COLORS
} from 'src/app/shared/global-functions';
import {
  NgbDate
} from '@ng-bootstrap/ng-bootstrap';
import {
  BarChartComponent
} from './bar-chart/bar-chart.component';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';






@Component({
  selector: 'app-daily-total',
  templateUrl: './daily-total.component.html',
  styleUrls: ['./daily-total.component.scss']
})
export class DailyTotalComponent implements OnInit {

  @ViewChild('chartsContainer', {
    read: ViewContainerRef,
    static: true
  }) chartsContainer: ViewContainerRef;

  private chartComponentList: any[] = [];

  private NB_CHARTS_LIMIT = 3;

  // public currWeek = moment().day() === 0 ? [moment().subtract(2, 'months').day(-6), moment().subtract(2, 'months').day(7)].map(toNgbDate) : [moment().subtract(2, 'months').day(1), moment().subtract(2, 'months').day(14)].map(toNgbDate);
  public currWeek = [moment('10/02/2020', 'DD/MM/YYYY'), moment('23/02/2020', 'DD/MM/YYYY')].map(toNgbDate);

  public stubChartOptions: Partial < ChartOptions > = {
    series: [{
      name: 'Day total usage kWh',
      type: 'bar',
      data: [32, 25, 36, 34, 28, 24, 20]
    }, {
      name: 'Total average',
      type: 'line',
      data: [30, 30, 30, 30, 30, 30, 30]
    }, {
      name: 'Excluding weekends average',
      type: 'line',
      data: [33, 33, 33, 33, 33, 33, 33]
    }],
    colors: [COLORS.$dark, COLORS.$success, COLORS.$warning],
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      animations: {
        enabled: false
      }
    },
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: 'top' // top, center, bottom
        }
      }
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [],
      tickPlacement: 'between',
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      min: 0,
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: true
      },
      labels: {
        formatter: (val) => {
          return val.toFixed(2) + ' kWh';
        }
      }
    },
    title: {
      text: 'Total usage in kWh per day',
      align: 'left',
      style: {
        fontWeight: 600,
        fontFamily: 'inherit'
      }
    },
    tooltip: {
      enabled: false,
    }
  };


  constructor(
    private cfr: ComponentFactoryResolver,
  ) {}

  ngOnInit(): void {
    this.addBarChart();
  }


  private createComponent() {
    const compFactory = this.cfr.resolveComponentFactory(BarChartComponent);
    return this.chartsContainer.createComponent(compFactory);
  }

  public addBarChart() {
    if (this.canAddChart()) {
      const comp = this.createComponent();
      comp.instance.initDateRange = this.currWeek;
      comp.instance.randomId = this.chartComponentList.length;
      comp.instance.selfRef = comp;
      comp.changeDetectorRef.detectChanges();
      comp.onDestroy(() => {
        this.removeCompFromListAndRefreshList(comp);
      });
      this.chartComponentList.push(comp);
    }
  }


  public canAddChart(): boolean {
    return this.chartComponentList.length < this.NB_CHARTS_LIMIT;
  }

  private removeCompFromListAndRefreshList(comp) {
    const newList = [];
    let i = 0;
    const toRemoveIndex = comp.instance.randomId;
    this.chartComponentList.forEach(c => {
      if (c.instance.randomId !== toRemoveIndex) {
        c.instance.randomId = i;
        newList.push(c);
        i++;
      }
    })
    this.chartComponentList = newList;
  }

}
