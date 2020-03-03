import { Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { toNgbDate } from 'src/app/shared/global-functions';

@Component({
  selector: 'app-vergelijk-duaal',
  templateUrl: './vergelijk-duaal.component.html',
  styleUrls: ['./vergelijk-duaal.component.scss']
})
export class VergelijkDuaalComponent implements OnInit {

  public initialDateRange: NgbDate[] = [];

  constructor() { }

  ngOnInit(): void {
    this.initialDateRange = [toNgbDate(moment())];
  }

}
