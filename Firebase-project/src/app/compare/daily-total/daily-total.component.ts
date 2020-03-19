import {
  Component,
  OnInit,
} from '@angular/core';

import * as moment from 'moment';
import {
  toNgbDate
} from 'src/app/shared/global-functions';
import {
  NgbDate
} from '@ng-bootstrap/ng-bootstrap';






@Component({
  selector: 'app-daily-total',
  templateUrl: './daily-total.component.html',
  styleUrls: ['./daily-total.component.scss']
})
export class DailyTotalComponent implements OnInit {

  private NB_CHARTS_LIMIT = 5;
  public initDateRanges: NgbDate[][];
  private currWeek = moment().day() === 0 ? [moment().day(-6), moment().day(0)].map(toNgbDate) :
  [moment().day(1), moment().day(7)].map(toNgbDate);


  constructor() {
    this.initDateRanges = [this.currWeek];
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
    this.initDateRanges.push(this.currWeek);
  }

  removeBarChart(): void {
    this.initDateRanges.pop();
  }

  canAddChart(): boolean {
    return this.initDateRanges.length < this.NB_CHARTS_LIMIT;
  }

}
