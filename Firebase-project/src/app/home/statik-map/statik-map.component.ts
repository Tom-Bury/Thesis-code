import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  toNgbDate
} from 'src/app/shared/global-functions';

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

  public colors: any;
  public isLoading = true;

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {}

  ngOnInit(): void {
    this.colors = {
      others: '#ffffff',
      keuken: '#ffffff',
      vergader1: '#ffffff',
      vergader2: '#ffffff',
      vergader3: '#ffffff',
      bureau1: '#ffffff',
      bureau2: '#ffffff'
    };
  }

  ngAfterViewInit(): void {
    this.isLoading = true;

    this.dataFetcherSvc.getFusesKwh(
      this.lastThirtyMinsDateRange[0],
      this.lastThirtyMinsTimeRange[0],
      this.lastThirtyMinsDateRange[1],
      this.lastThirtyMinsTimeRange[1]).subscribe(
      (data) => {
        if (!data.isError) {

          const values = {
            others: 0,
            keuken: 0,
            vergader1: 0,
            vergader2: 0,
            vergader3: 0,
            bureau1: 0,
            bureau2: 0
          };

          this.dataFetcherSvc.getFuseNames().forEach(fn => {
            values[this.fuseNameToRectId(fn)] += data.value.values[fn];
          });


          Object.keys(values).forEach(key => {
            const oldVal = values[key];
            let newVal = this.numberMap(oldVal, 0, 0.1, 0, 510) > 510 ? 255 : this.numberMap(oldVal, 0, 0.1, 0, 510) - 255;
            newVal = Math.round(newVal);
            let colRed = newVal >= 0 ? 255 : newVal * (-1);
            let colGreen = newVal <= 0 ? 255 : newVal;

            if (newVal === -255) {
              colRed = 0;
              colGreen = 255;
            } else if (newVal === 255) {
              colRed = 255;
              colGreen = 0;
            }

            this.colors[key] = this.RGBToHex(colRed, colGreen, 0);
          });
        }
      },
      (error) => {
        console.error(error);
        this.colors = {
          others: '#ffffff',
          keuken: '#ffffff',
          vergader1: '#ffffff',
          vergader2: '#ffffff',
          vergader3: '#ffffff',
          bureau1: '#ffffff',
          bureau2: '#ffffff'
        };
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  private numberMap(n: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (n - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  private RGBToHex(r: number, g: number, b: number): string {
    let rr = r.toString(16);
    let gg = g.toString(16);
    let bb = b.toString(16);

    if (rr.length === 1) {
      rr = '0' + rr;
    }
    if (gg.length === 1) {
      gg = '0' + gg;
    }
    if (bb.length === 1) {
      bb = '0' + bb;
    }
    return '#' + rr + gg + bb;
  }


  private fuseNameToRectId(fn: string): string {
    let id = '';
    switch (fn) {
      case 'SC serverlokaal':
        id = 'others';
        break;
      case 'Voeding vaatwas':
        id = 'keuken';
        break;
      case 'Voeding ventilatie':
        id = 'others';
        break;
      case 'Licht & SC WC & stookplaats':
        id = 'others';
        break;
      case 'Voeding boiler':
        id = 'keuken';
        break;
      case 'Voedingen Velux achter bureau 2, uitbereiding alarm':
        id = 'others';
        break;
      case 'Licht bureau 1, inkomzone, traphal, vergaderlokaal 2':
        id = 'bureau1';
        break;
      case 'Licht directielokaal, vergaderlokaal 1, terras, bureau 2':
        id = 'bureau2';
        break;
      case 'SC & licht keuken':
        id = 'keuken';
        break;
      case 'Vloerdoos vergaderlokaal 1':
        id = 'vergader1';
        break;
      case 'Vloerdoos bureau 1':
        id = 'bureau1';
        break;
      case 'Vloerdoos bureau 2':
        id = 'bureau2';
        break;
      case 'SC inkomzone, vergaderlokaal 1 & 2, directielokaal, velux achter':
        id = 'vergader2';
        break;
      case 'SC bureau 1, licht serverlokaal, licht & SC berging & bureau\'s boven':
        id = 'vergader3';
        break;
      case 'Licht centraal LED-strip':
        id = 'others';
        break;
    }
    return id;
  }

}
