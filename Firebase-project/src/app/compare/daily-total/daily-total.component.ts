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

  private NB_CHARTS_LIMIT = 3;

  public currWeek = moment().day() === 0 ? [moment().day(-6), moment().day(0)].map(toNgbDate) :
  [moment().day(1), moment().day(7)].map(toNgbDate);


  constructor() {
   }

  ngOnInit(): void {}

  addBarChart(): void {

  }

  removeBarChart(index: number): void {
  }

  canAddChart(): boolean {
    return true;
  }

}
