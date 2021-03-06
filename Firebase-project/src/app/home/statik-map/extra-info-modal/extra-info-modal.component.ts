import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-extra-info-modal',
  templateUrl: './extra-info-modal.component.html',
  styleUrls: ['./extra-info-modal.component.scss']
})
export class ExtraInfoModalComponent implements OnInit {

  @ViewChild('extraInfoModal') extraInfoModal: ElementRef;

  public useEqualScales = new Subject<boolean>();
  public useEqualScalesLocal = false;
  public maxValue = -1;

  public roomName = '';
  public isLoading = true;
  public currSensorIds: string[] = [];
  public currSensorMatchingUsages: number[] = [];
  public currSensorMatchingFuseNames: string[] = [];
  public showCharts = false;

  public allSensorDistributionData: any = {};

  private currDateRange: NgbDate[] = [];
  private currTimeRange: NgbTimeStruct[] = [];
  private currFuses: string[] = [];

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {}

  ngOnInit(): void {}

  public openModalForRoom(roomId: string, roomName: string, dateRange: NgbDate[], timeRange: NgbTimeStruct[]): void {
    this.roomName = roomName;
    this.currDateRange = dateRange;
    this.currTimeRange = timeRange;
    this.currFuses = this.roomIDToFuseNames(roomId);
    this.fetchSensorsData();
    $(this.extraInfoModal.nativeElement).modal('show');
  }

  private roomIDToFuseNames(roomId: string): string[] {
    let fuseNames = [];
    switch (roomId) {
      case 'others':
        fuseNames = ['SC serverlokaal', 'Voeding ventilatie', 'Licht & SC WC & stookplaats', 'Voedingen Velux achter bureau 2, uitbereiding alarm', 'Licht centraal LED-strip'];
        break;
      case 'keuken':
        fuseNames = ['Voeding vaatwas', 'Voeding boiler', 'SC & licht keuken'];
        break;
      case 'bureau1':
        fuseNames = ['Licht bureau 1, inkomzone, traphal, vergaderlokaal 2', 'Vloerdoos bureau 1'];
        break;
      case 'bureau2':
        fuseNames = ['Licht directielokaal, vergaderlokaal 1, terras, bureau 2', 'Vloerdoos bureau 2'];
        break;
      case 'vergader1':
        fuseNames = ['Vloerdoos vergaderlokaal 1'];
        break;
      case 'vergader2':
        fuseNames = ['SC inkomzone, vergaderlokaal 1 & 2, directielokaal, velux achter'];
        break;
      case 'vergader3':
        fuseNames = ['SC bureau 1, licht serverlokaal, licht & SC berging & bureau\'s boven'];
        break;
      default:
        console.error('Unexpected room id: ' + roomId);
        break;
    }

    return fuseNames;
  }

  private fetchSensorsData(): void {
    this.isLoading = true;
    this.useEqualScalesLocal = false;
    this.dataFetcherSvc.getSensorsKwh(this.currDateRange[0], this.currTimeRange[0], this.currDateRange[1], this.currTimeRange[1])
      .subscribe(
        data => {
          if (!data.isError) {
            const sensorValues = data.value.values;
            this.setData(sensorValues);
          } else {
            console.error('Error in received sensor data: ', data.value);
            this.resetData();
          }
        },
        error => {
          console.error('Could not fetch sensors data: ', error);
          this.resetData();
        },
        () => {
          this.isLoading = false;
        }
      );


    this.showCharts = false;
    this.maxValue = -1;
    this.allSensorDistributionData = {};
    this.dataFetcherSvc.getAllSensorsWattDistribution(this.currDateRange[0], this.currTimeRange[0], this.currDateRange[1], this.currTimeRange[1])
      .subscribe(
        data => {
          if (!data.isError) {
            data.value.results.forEach(r => {
              this.allSensorDistributionData[r.sensorID] = r;
            });

            this.currSensorIds.forEach(sID => {
              const currMax = Math.max(...this.allSensorDistributionData[sID].data.map(d => d.value));
              this.maxValue = currMax > this.maxValue ? currMax : this.maxValue;
            });
            this.showCharts = true;
          } else {
            console.error('Error in received sensors distribution data: ', data.value);
          }
        },
        error => {
          console.error('Could not fetch sensors distribution data: ', error);
        },
        () => {
          // TODO
        }
      );
  }

  private resetData(): void {
    this.currSensorIds = [];
    this.currSensorMatchingUsages = [];
    this.currSensorMatchingFuseNames = [];
    this.roomName = '';
    this.currDateRange = [];
    this.currTimeRange = [];
    this.currFuses = [];
    this.showCharts = false;
    this.maxValue = -1;
  }

  private setData(sensorValues: any): void {
    // Clean
    this.currSensorIds = [];
    this.currSensorMatchingUsages = [];
    this.currSensorMatchingFuseNames = [];

    // Register matching sensorIDs data
    const allSensorIds = Object.keys(sensorValues);
    allSensorIds.forEach(sID => {
      const currFuse = sensorValues[sID].fuse;
      const currValue = sensorValues[sID].value;

      if (this.currFuses.includes(currFuse)) {
        this.currSensorIds.push(sID);
        this.currSensorMatchingUsages.push(currValue);
        this.currSensorMatchingFuseNames.push(currFuse.replace(/ SC/g, ' stopcontacten').replace(/SC/g, 'Stopcontacten'));
      }
    });
  }


  public getCurrTotalUsage(): number {
    return this.currSensorMatchingUsages.reduce((total, curr) => total + curr, 0);
  }

  public toggleScale(): void {
    this.useEqualScalesLocal = !this.useEqualScalesLocal;
    this.useEqualScales.next(this.useEqualScalesLocal);
  }
}
