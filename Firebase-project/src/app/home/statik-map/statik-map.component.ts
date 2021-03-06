import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
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
  toNgbDate, getDummyDayMomentObj
} from 'src/app/shared/global-functions';
import {
  ExtraInfoModalComponent
} from './extra-info-modal/extra-info-modal.component';

@Component({
  selector: 'app-statik-map',
  templateUrl: './statik-map.component.html',
  styleUrls: ['./statik-map.component.scss']
})
export class StatikMapComponent implements OnInit, AfterViewInit {

  @ViewChild('mapExtraInfoModal') mapExtraInfoModal: ExtraInfoModalComponent;


  lastThirtyMinsDateRange: NgbDate[] = [getDummyDayMomentObj(), getDummyDayMomentObj()].map(toNgbDate);
  lastThirtyMinsTimeRange: NgbTimeStruct[] = [{
    hour: getDummyDayMomentObj().hour(moment().hour()).minute(moment().minute()).subtract(30, 'm').hour(),
    minute:  getDummyDayMomentObj().hour(moment().hour()).minute(moment().minute()).subtract(30, 'm').minute(),
    second: 0
  }, {
    hour:  getDummyDayMomentObj().hour(moment().hour()).minute(moment().minute()).hour(),
    minute:  getDummyDayMomentObj().hour(moment().hour()).minute(moment().minute()).minute(),
    second: 0
  }];

  public colors: any;
  public textColors: any;
  public isLoading = true;
  public colRange = [];

  public puslatingClass: any;

  public tooltipShown = false;
  public tooltipKwh = -1;
  public tooltipTitle = '';
  public tooltipColor = '#fff';
  private currHover = 'others';
  public values = {};

  // private greenToYellowToRed = [
  //   '#40f99b', '#4df894', '#59f78e', '#63f587', '#6cf481', '#73f37c', '#7af176', '#81f071', '#88ef6b', '#8fed65', '#96ec5f', '#9dea59',
  //   '#a3e853', '#a9e74d', '#afe548', '#b5e342', '#bae13d', '#c0df38', '#c5dd33', '#cbdb2e', '#d0d928', '#d6d623', '#dbd41e',
  //   '#ded119', '#e1ce13', '#e3ca0d', '#e6c707', '#e8c404', '#eac202', '#ecbf00', '#eebc00', '#f1b900', '#f3b500', '#f5b200',
  //   '#f7af00', '#f9ab00', '#fba800', '#fda401', '#fea003', '#fe9d05', '#ff9907', '#ff940a', '#ff8f0e', '#ff8a11', '#ff8514',
  //   '#ff8017', '#ff7b1a', '#fe751c', '#fe701f', '#fd6b21', '#fd6724', '#fc6226', '#fb5c29', '#fa562b', '#f9502e', '#f84a30',
  //   '#f84a30', '#f64233', '#f43936', '#f22f39', '#ef233c'
  // ];

  private colorDarkShades = [
    '#f7f6ff', '#efedfa', '#e7e5f6', '#dfdcf1',
    '#d7d4ec', '#cecbe7', '#c6c1e2', '#bdb8dd',
    '#b5afd8', '#ada6d3', '#a49dcf', '#9c95ca',
    '#948cc5', '#8c83c0', '#837abb', '#7b72b5',
    '#7369b0', '#6b61ab', '#6358a6', '#5a50a1', '#52489c'  ];

  private whiteTextIndex = 12;

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

    this.textColors = {
      others: '#000',
      keuken: '#000',
      vergader1: '#000',
      vergader2: '#000',
      vergader3: '#000',
      bureau1: '#000',
      bureau2: '#000'
    };


    this.puslatingClass = {
      others: '',
      keuken: '',
      vergader1: '',
      vergader2: '',
      vergader3: '',
      bureau1: '',
      bureau2: '',
    };

    // let i;
    // for (i = 0; i < 100; i++) {
    //   // Push 100 colors from green --> yellow --> orange --> red
    //   this.colRange.push(this.numberToColorHsl(99 - i));
    // }
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

          this.values = {
            others: 0,
            keuken: 0,
            vergader1: 0,
            vergader2: 0,
            vergader3: 0,
            bureau1: 0,
            bureau2: 0
          };

          this.dataFetcherSvc.getFuseNames().forEach(fn => {
            if (data.value.values[fn]) {
              this.values[this.fuseNameToRectId(fn)] += data.value.values[fn];
            }
          });

          const numbers: number[] = Object.values(this.values);
          const maxVal = Math.max(...numbers);
          const max = maxVal > 0.1 ? maxVal : 0.1;
          Object.keys(this.values).forEach(key => {
            const value = this.values[key];
            const pulseIndex = Math.floor(this.numberMap(value, 0, max + 0.001, 0, 100));

            if (pulseIndex > 90) {
              this.puslatingClass[key] = 'pulsate-super-fast';
            } else if (pulseIndex > 75) {
              this.puslatingClass[key] = 'pulsate-fast';
            } else if (pulseIndex > 50) {
              this.puslatingClass[key] = 'pulsate-medium';
            } else if (pulseIndex > 25) {
              this.puslatingClass[key] = 'pulsate-slow';
            } else if (pulseIndex > 10) {
              this.puslatingClass[key] = 'pulsate-super-slow';
            } else {
              this.puslatingClass[key] = '';
            }

            const newColorIndex =  Math.floor(this.numberMap(value, 0, max + 0.001, 0, this.colorDarkShades.length - 1));
            this.colors[key] = this.colorDarkShades[newColorIndex];
            this.textColors[key] = newColorIndex > 8 ? '#fff' : '#000';
          });
        } else {
          console.error('Error in received fuses kwh data', data.value)
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

  public showTooltipFor(id: string): void {
    this.tooltipShown = true;
    this.tooltipKwh = this.values[id];
    this.tooltipColor = this.colors[id];
    this.tooltipTitle = this.idToProperRoomName(id);
    this.currHover = id;

    window.onmousemove = (e) => {
      const tooltip = document.getElementById('map-tooltip');
      if (tooltip && this.tooltipShown) {
        const x = (e.clientX + this.idToTooltipOffsetX(this.currHover)) + 'px';
        const y = (e.clientY + this.idToTooltipOffsetY(this.currHover)) + 'px';
        tooltip.style.top = y;
        tooltip.style.left = x;
      }
    };
  }

  public hideTooltip(): void {
    this.tooltipShown = false;
    window.onmousemove = null;
  }

  private numberMap(n: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (n - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  // private RGBToHex(r: number, g: number, b: number): string {
  //   let rr = r.toString(16);
  //   let gg = g.toString(16);
  //   let bb = b.toString(16);

  //   if (rr.length === 1) {
  //     rr = '0' + rr;
  //   }
  //   if (gg.length === 1) {
  //     gg = '0' + gg;
  //   }
  //   if (bb.length === 1) {
  //     bb = '0' + bb;
  //   }
  //   return '#' + rr + gg + bb;
  // }


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

  // /**
  //  * http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
  //  *
  //  * Converts an HSL color value to RGB. Conversion formula
  //  * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
  //  * Assumes h, s, and l are contained in the set [0, 1] and
  //  * returns r, g, and b in the set [0, 255].
  //  *
  //  * @param   Number  h       The hue
  //  * @param   Number  s       The saturation
  //  * @param   Number  l       The lightness
  //  * @return  Array           The RGB representation
  //  */
  // private hslToRgb(h, s, l) {
  // //   var r, g, b;

  //   if (s == 0) {
  //     r = g = b = l; // achromatic
  //   } else {
  //     function hue2rgb(p, q, t) {
  //       if (t < 0) {
  //         t += 1;
  //       }
  //       if (t > 1) {
  //         t -= 1;
  //       }
  //       if (t < 1 / 6) {
  //         return p + (q - p) * 6 * t;
  //       }
  //       if (t < 1 / 2) {
  //         return q;
  //       }
  //       if (t < 2 / 3) {
  //         return p + (q - p) * (2 / 3 - t) * 6;
  //       }
  //       return p;
  //     }

  //     var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  //     var p = 2 * l - q;
  //     r = hue2rgb(p, q, h + 1 / 3);
  //     g = hue2rgb(p, q, h);
  //     b = hue2rgb(p, q, h - 1 / 3);
  //   }

  //   return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
  // }

  // // convert a number to a color using hsl
  // private numberToColorHsl(i) {
  //   // as the function expects a value between 0 and 1, and red = 0° and green = 120°
  //   // we convert the input to the appropriate hue value
  //   var hue = i * 1.2 / 360;
  //   // we convert hsl to rgb (saturation 100%, lightness 50%)
  //   var rgb = this.hslToRgb(hue, 1, .5);
  //   // we format to css value and return
  //   return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
  // }

  private idToTooltipOffsetX(id: string): number {
    switch (id) {
      case 'others':
        return -200;
      case 'keuken':
        return -100;
      case 'vergader1':
        return -200;
      case 'vergader2':
        return 15;
      case 'vergader3':
        return 15;
      case 'bureau1':
        return -20;
      case 'bureau2':
        return -20;
    }
  }

  private idToTooltipOffsetY(id: string): number {
    switch (id) {
      case 'others':
        return -75;
      case 'keuken':
        return 20;
      case 'vergader1':
        return 20;
      case 'vergader2':
        return 20;
      case 'vergader3':
        return -10;
      case 'bureau1':
        return 15;
      case 'bureau2':
        return 15;
    }
  }

  private idToProperRoomName(id: string): string {
    switch (id) {
      case 'others':
        return 'Rest';
      case 'keuken':
        return 'Keuken';
      case 'vergader1':
        return 'Vergaderzaal 1';
      case 'vergader2':
        return 'Vergaderzaal 2';
      case 'vergader3':
        return 'Vergaderzaal 3';
      case 'bureau1':
        return 'Bureaus 1';
      case 'bureau2':
        return 'Bureaus 2';
    }
  }

  public showingTooltipFor(id: string): boolean {
    return this.tooltipShown && this.currHover === id;
  }

  public handleMapClick(): void {
    if (this.tooltipShown) {
      this.mapExtraInfoModal.openModalForRoom(this.currHover, this.tooltipTitle, this.lastThirtyMinsDateRange, this.lastThirtyMinsTimeRange);
    }
  }
}
