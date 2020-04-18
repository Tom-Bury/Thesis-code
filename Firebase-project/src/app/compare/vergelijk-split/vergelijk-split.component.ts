import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { toNgbDate } from 'src/app/shared/global-functions';
import * as moment from 'moment';
import { CompareLineChartComponent } from './compare-line-chart/compare-line-chart.component';

@Component({
  selector: 'app-vergelijk-split',
  templateUrl: './vergelijk-split.component.html',
  styleUrls: ['./vergelijk-split.component.scss']
})
export class VergelijkSplitComponent implements OnInit {

  public initDateRanges: NgbDate[][];
  private todayInitDateRange = [moment().startOf('day'), moment().endOf('day')].map(toNgbDate);

  @ViewChild('chartsContainer', {
    read: ViewContainerRef,
    static: true
  }) chartsContainer: ViewContainerRef;
  private chartComponentList: any[] = [];
  private NB_CHARTS_LIMIT = 3;



  constructor(
    private cfr: ComponentFactoryResolver,
  ) {}

  ngOnInit(): void {
    this.addBarChart();
  }


  private createComponent() {
    const compFactory = this.cfr.resolveComponentFactory(CompareLineChartComponent);
    return this.chartsContainer.createComponent(compFactory);
  }

  public addBarChart() {
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
