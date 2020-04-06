import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef
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
  public colRange = [];

  public showTooltip = false;
  public tooltipKwh = -1;
  public tooltipTitle = '';
  public tooltipColor = '#fff';
  private currHover = 'others';
  public values = {};

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

    let i;
    for (i = 0; i < 100; i++) {
      // Push 100 colors from green --> yellow --> orange --> red
      this.colRange.push(this.numberToColorHsl(99 - i));
    }


    const tooltips = document.querySelectorAll('span');

    window.onmousemove = (e) => {
      const x = (e.clientX + this.idToTooltipOffsetX(this.currHover)) + 'px';
      const y = (e.clientY + this.idToTooltipOffsetY(this.currHover)) + 'px';
      tooltips.forEach(el => {
        const ell = el as unknown as HTMLElement;
        ell.style.top = y;
        ell.style.left = x;
      });
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

          const max = 0.1;
          Object.keys(this.values).forEach(key => {
            const value = this.values[key];
            const colorIndex = Math.floor(this.numberMap(value, 0, max, 0, 100));
            this.colors[key] = this.colRange[colorIndex];
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

  public showTooltipFor(id: string): void {
    this.showTooltip = true;
    this.tooltipKwh = this.values[id];
    this.tooltipColor = this.colors[id];
    this.tooltipTitle = this.idToProperRoomName(id);
    this.currHover = id;
  }

  public hideTooltip(): void {
    this.showTooltip = false;
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

  /**
   * http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
   *
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   Number  h       The hue
   * @param   Number  s       The saturation
   * @param   Number  l       The lightness
   * @return  Array           The RGB representation
   */
  private hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) {
          t += 1;
        }
        if (t > 1) {
          t -= 1;
        }
        if (t < 1 / 6) {
          return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
          return q;
        }
        if (t < 2 / 3) {
          return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
  }

  // convert a number to a color using hsl
  numberToColorHsl(i) {
    // as the function expects a value between 0 and 1, and red = 0° and green = 120°
    // we convert the input to the appropriate hue value
    var hue = i * 1.2 / 360;
    // we convert hsl to rgb (saturation 100%, lightness 50%)
    var rgb = this.hslToRgb(hue, 1, .5);
    // we format to css value and return
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
  }

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


}
