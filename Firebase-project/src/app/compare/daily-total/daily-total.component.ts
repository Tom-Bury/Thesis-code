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
  toNgbDate
} from 'src/app/shared/global-functions';
import {
  NgbDate
} from '@ng-bootstrap/ng-bootstrap';
import {
  BarChartComponent
} from './bar-chart/bar-chart.component';






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

  public currWeek = moment().day() === 0 ? [moment().day(-6), moment().day(0)].map(toNgbDate) : [moment().day(1), moment().day(7)].map(toNgbDate);


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
