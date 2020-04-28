import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import {
  NgbDate
} from '@ng-bootstrap/ng-bootstrap';
import {
  toNgbDate
} from 'src/app/shared/global-functions';
import * as moment from 'moment';
import {
  CompareLineChartComponent
} from './compare-line-chart/compare-line-chart.component';
import {
  ChartOptions
} from 'src/app/shared/interfaces/chart-options.model';
import {
  stubSeries,
  stubLabels
} from './stub-vergelijk-chart-data.js';

@Component({
  selector: 'app-vergelijk-split',
  templateUrl: './vergelijk-split.component.html',
  styleUrls: ['./vergelijk-split.component.scss']
})
export class VergelijkSplitComponent implements OnInit {

  private todayInitDateRange = [moment().subtract(2, 'months').startOf('day'), moment().subtract(2, 'months').endOf('day')].map(toNgbDate);

  @ViewChild('chartsContainer', {
    read: ViewContainerRef,
    static: true
  }) chartsContainer: ViewContainerRef;
  private chartComponentList: any[] = [];
  private NB_CHARTS_LIMIT = 3;

  public stubChartOptions: Partial < ChartOptions > = {
    series: [{
      name: 'Total usage in Watts',
      data: []
    }],
    labels: [],
    noData: {
      text: 'Data is unavailable'
    },
    chart: {
      type: 'line',
      height: 450,
      animations: {
        enabled: false
      },
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
    stroke: {
      curve: 'smooth',
      width: 2
    },
    dataLabels: {
      enabled: false
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
          year: 'HH:mm',
          month: 'HH:mm',
          day: 'HH:mm',
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
        text: 'Total usage in Watts'
      },
      decimalsInFloat: 0
    },
    legend: {
      show: true,
      itemMargin: {
        vertical: 5
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
    this.addChart();
    this.stubChartOptions.series = stubSeries;
    this.stubChartOptions.labels = stubLabels;
  }


  private createComponent() {
    const compFactory = this.cfr.resolveComponentFactory(CompareLineChartComponent);
    return this.chartsContainer.createComponent(compFactory);
  }

  public addChart() {
    if (this.canAddChart()) {
      const comp = this.createComponent();
      comp.instance.initDateRange = this.todayInitDateRange;
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
