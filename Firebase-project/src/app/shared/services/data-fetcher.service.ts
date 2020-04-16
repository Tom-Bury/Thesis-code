import {
  Injectable
} from '@angular/core';
import {
  environment
} from 'src/environments/environment';
import {
  HttpClient
} from '@angular/common/http';
import {
  ApiResult
} from '../interfaces/api/api-result.model';
import {
  Observable
} from 'rxjs';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import {
  ngbDateTimeToApiString
} from '../global-functions';
import {
  ApiTotalUsagePerDay
} from '../interfaces/api/api-total-usage-per-day.model';
import {
  ApiFusesKwhPerInterval
} from '../interfaces/api/api-fuses-kwh-per-interval.model';
import {
  ApiFusesKwh
} from '../interfaces/api/api-fuses-kwh.model';
import { ApiSensorsKwh } from '../interfaces/api/api-sensors-kwh.model';
import { ApiTotalWattDistribution } from '../interfaces/api/api-total-watt-distribution-multiple.model';
import { ApiTotalWattDistributionMultiple } from '../interfaces/api/api-total-watt-distribution.model';

export interface FuseEntry {
  sensorId: string[];
  concentratorId: string[];
  gatewayId: string[];
}


@Injectable({
  providedIn: 'root'
})
export class DataFetcherService {

  private BASE_URL = environment.apiBaseUrl;
  private fuseNames: string[] = [];
  private fuseInfo: any = {};
  private sensors: any = {}; // {sensorId: {fuse, usageCategories[]}}

  constructor(
    private http: HttpClient
  ) {
    this.setFusesInfo();
    this.setSensorsInfo();
  }


  // ---------------------
  // FUSE INFO GETTERS
  // ---------------------

  public getFuseNames(): string[] {
    return [...this.fuseNames];
  }

  public getFuseInfo(fuseName: string): FuseEntry {
    return {
      ...this.fuseInfo[fuseName]
    };
  }

  public getFuseNameOfSensorId(sensorId: string): string {
    return this.sensors[sensorId].fuse;
  }

  public getCategoriesForSensorID(sensorID: string): string[] {
    return this.sensors[sensorID].usageCategories;
  }


  // -------------------------
  // API CALLS: total usage
  // -------------------------


  public getTotalUsagePerDay(from: NgbDate, to ? : NgbDate): Observable < ApiTotalUsagePerDay > {
    const toQueryParam = to ? '&to=' + ngbDateTimeToApiString(to) : '';
    const url = this.BASE_URL + '/totalUsagePerDay?from=' + ngbDateTimeToApiString(from) + toQueryParam;
    return this.http.get < ApiTotalUsagePerDay > (url);
  }

  public getFuseKwhPerInterval(
    interval: string, fromDate: NgbDate, fromTime ? : NgbTimeStruct,
    toDate ? : NgbDate, toTime ? : NgbTimeStruct, intervalAmount = 1): Observable < ApiFusesKwhPerInterval > {
    const fromQueryParam = fromTime ? ngbDateTimeToApiString(fromDate, fromTime) : ngbDateTimeToApiString(fromDate);
    const toQueryParam = toDate ? '&to=' + (toTime ? ngbDateTimeToApiString(toDate, toTime) : ngbDateTimeToApiString(toDate)) : '';

    const url = this.BASE_URL + '/fusesKwhPerInterval?from=' + fromQueryParam + toQueryParam + '&interval=' +
      interval + '&intervalAmount=' + intervalAmount;
    console.log(url);
    return this.http.get < ApiFusesKwhPerInterval > (url);
  }


  public getFusesKwh(
    fromDate: NgbDate, fromTime ? : NgbTimeStruct,
    toDate ? : NgbDate, toTime ? : NgbTimeStruct): Observable < ApiFusesKwh > {

    const fromQueryParam = fromTime ? ngbDateTimeToApiString(fromDate, fromTime) : ngbDateTimeToApiString(fromDate);
    const toQueryParam = toDate ? '&to=' + (toTime ? ngbDateTimeToApiString(toDate, toTime) : ngbDateTimeToApiString(toDate)) : '';
    const url = this.BASE_URL + '/fusesKwh?from=' + fromQueryParam + toQueryParam;

    return this.http.get < ApiFusesKwh > (url);
  }

  public getSensorsKwh(
    fromDate: NgbDate, fromTime ? : NgbTimeStruct,
    toDate ? : NgbDate, toTime ? : NgbTimeStruct): Observable <ApiSensorsKwh> {

    const fromQueryParam = fromTime ? ngbDateTimeToApiString(fromDate, fromTime) : ngbDateTimeToApiString(fromDate);
    const toQueryParam = toDate ? '&to=' + (toTime ? ngbDateTimeToApiString(toDate, toTime) : ngbDateTimeToApiString(toDate)) : '';
    const url = this.BASE_URL + '/sensorsKwh?from=' + fromQueryParam + toQueryParam;

    return this.http.get <ApiSensorsKwh> (url);
  }


  // --------------------------------
  // API CALLS: usage distribution
  // --------------------------------

  public getTotalWattDistribution(
    fromDate: NgbDate, fromTime ? : NgbTimeStruct,
    toDate ? : NgbDate, toTime ? : NgbTimeStruct): Observable <ApiTotalWattDistribution> {
    const fromQueryParam = fromTime ? ngbDateTimeToApiString(fromDate, fromTime) : ngbDateTimeToApiString(fromDate);
    const toQueryParam = toDate ? '&to=' + (toTime ? ngbDateTimeToApiString(toDate, toTime) : ngbDateTimeToApiString(toDate)) : '';

    const url = this.BASE_URL + '/totalWattDistribution?from=' + fromQueryParam + toQueryParam;
    return this.http.get <ApiTotalWattDistribution> (url);
  }

  public getTotalWattDistributionMultiple(
    fromDates: NgbDate[],
    fromTimes: NgbTimeStruct[],
    toDates: NgbDate[],
    totimes: NgbTimeStruct[]): Observable <ApiTotalWattDistributionMultiple> {
    const length = fromDates.length;
    const url = this.BASE_URL + '/totalWattDistributionMultiple?timeframes=';

    if (fromTimes.length !== length || toDates.length !== length || totimes.length !== length) {
      throw new Error('getMultipleTotalUsageDistributions parameters must be arrays of equal length.');
    } else {
      const queryParam = [];
      for (let i = 0; i < length; i++) {
        queryParam.push({
          from: ngbDateTimeToApiString(fromDates[i], fromTimes[i]),
          to: ngbDateTimeToApiString(toDates[i], totimes[i])
        });
      }

      return this.http.get <ApiTotalWattDistributionMultiple> (url + JSON.stringify(queryParam));
    }
  }




  private setFusesInfo(): void {
    const fuseUrl = this.BASE_URL + '/allFuses';
    this.http.get<ApiResult<any>>(fuseUrl).subscribe(
      (data) => {
        this.fuseNames = Object.keys(data.value);
        this.fuseInfo = data.value;
      },
      (error) => {
        console.error('Could not fetch fuse data', error);
      }
    );
  }

  private setSensorsInfo(): void {
    const sensorUrl = this.BASE_URL + '/allSensors';
    this.http.get < ApiResult < any >> (sensorUrl).subscribe(
      (data) => {
        this.sensors = data.value;
      },
      (error) => {
        console.error('Could not fetch sensor data', error);
      }
    );
  }

}
