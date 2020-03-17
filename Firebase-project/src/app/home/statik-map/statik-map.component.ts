import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataFetcherService } from 'src/app/shared/services/data-fetcher.service';
import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { toNgbDate } from 'src/app/shared/global-functions';

@Component({
  selector: 'app-statik-map',
  templateUrl: './statik-map.component.html',
  styleUrls: ['./statik-map.component.scss']
})
export class StatikMapComponent implements OnInit, AfterViewInit {

  // lastThirtyMinsDateRange: NgbDate[] = [moment().subtract(30, 'm'), moment()].map(toNgbDate);
  // lastThirtyMinsTimeRange: NgbTimeStruct[] = [{
  //   hour: moment().subtract(30, 'm').hour(),
  //   minute: moment().subtract(30, 'm').minute(),
  //   second: 0
  // }, {
  //   hour: moment().hour(),
  //   minute: moment().minute(),
  //   second: 0
  // }];

  lastThirtyMinsDateRange: NgbDate[] = [moment().subtract(10, 'd').subtract(30, 'm'), moment().subtract(10, 'd')].map(toNgbDate);
  lastThirtyMinsTimeRange: NgbTimeStruct[] = [{
    hour: moment().subtract(10, 'd').subtract(30, 'm').hour(),
    minute: moment().subtract(10, 'd').subtract(30, 'm').minute(),
    second: 0
  }, {
    hour: moment().subtract(10, 'd').hour(),
    minute: moment().subtract(10, 'd').minute(),
    second: 0
  }];

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Todo: make 1 API call for each fuse
    this.dataFetcherSvc.getFuseKwh('SC_&_licht_keuken',
      this.lastThirtyMinsDateRange[0],
      this.lastThirtyMinsTimeRange[0],
      this.lastThirtyMinsDateRange[1],
      this.lastThirtyMinsTimeRange[1]).subscribe(
        (data) => {

        },
        (error) => {
          console.error(error);
        }
      );
  }

}
