import { Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { toNgbDate } from 'src/app/shared/global-functions';
import * as moment from 'moment';

@Component({
  selector: 'app-vergelijk-split',
  templateUrl: './vergelijk-split.component.html',
  styleUrls: ['./vergelijk-split.component.scss']
})
export class VergelijkSplitComponent implements OnInit {

  private NB_CHARTS_LIMIT = 5;
  public initDateRanges: NgbDate[][];
  private todayInitDateRange = [moment().startOf('day'), moment().endOf('day')].map(toNgbDate);


  constructor() {
    this.initDateRanges = [this.todayInitDateRange];
   }

  ngOnInit(): void {}

  fabPressed(i: number): void {
    if (i === 0) {
      this.addBarChart();
    } else {
      this.removeBarChart();
    }
  }

  fab2Pressed(): void {
    this.removeBarChart();
  }

  addBarChart(): void {
    this.initDateRanges.push(this.todayInitDateRange);
  }

  removeBarChart(): void {
    this.initDateRanges.pop();
  }

  canAddChart(): boolean {
    return this.initDateRanges.length < this.NB_CHARTS_LIMIT;
  }
}
