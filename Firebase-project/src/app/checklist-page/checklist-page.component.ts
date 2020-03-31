import { Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { toNgbDate } from '../shared/global-functions';

@Component({
  selector: 'app-checklist-page',
  templateUrl: './checklist-page.component.html',
  styleUrls: ['./checklist-page.component.scss']
})
export class ChecklistPageComponent implements OnInit {

  public initialDateRange: NgbDate[] = moment().day() === 0 ? [moment().day(-6), moment().day(0)].map(toNgbDate) :
  [moment().day(1), moment().day(7)].map(toNgbDate);
  public isAggregateByDay = true;

  constructor() { }

  ngOnInit(): void {
  }

  public aggregateByWeek(): void {
    this.isAggregateByDay = false;
  }

  public aggregateByDay(): void {
    this.isAggregateByDay = true;
  }

}
