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
} from '../interfaces/api-interfaces/api-result.model';
import {
  ApiWeekUsageEntry
} from '../interfaces/api-interfaces/api-week-usage-entry.model';
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
  ApiTotalUsageEntry
} from '../interfaces/api-interfaces/api-total-usage-entry.model';
import {
  ApiStatistics
} from '../interfaces/api-interfaces/api-statistics.model';
import {
  ApiTotalDistributionEntry
} from '../interfaces/api-interfaces/api-total-distribution-entry.model';
import {
  ApiFuseKwhResult
} from '../interfaces/api-interfaces/api-fuse-kwh-result';
import { ApiMultipleTotalUsageDistributionEntry } from '../interfaces/api-interfaces/api-multiple-total-distribution-entry.model';
import { ApiMultipleResults } from '../interfaces/api-interfaces/api-multiple-results.model';

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

    const fuseUrl = this.BASE_URL + '/allFuses';
    this.http.get<ApiResult<FuseEntry[]>>(fuseUrl).subscribe(
      (data) => {
        this.fuseNames = Object.keys(data.value);
        this.fuseInfo = data.value;
      },
      (error) => {
        console.error('Could not fetch fuse data', error);
      }
    );

    const sensorUrl = this.BASE_URL + '/allSensors';
    this.http.get<ApiResult<any>>(sensorUrl).subscribe(
      (data) => {
        this.sensors = data.value;
      },
      (error) => {
        console.error('Could not fetch sensor data', error);
      }
    );
  }

  public getFuseNames(): string[] {
    return [...this.fuseNames];
  }

  public getFuseInfo(fuseName: string): FuseEntry {
    return {...this.fuseInfo[fuseName]};
  }

  public getFuseNameOfSensorId(sensorId: string): string {
    return this.sensors[sensorId].fuse;
  }


  getWeekUsage(): Observable < ApiResult < ApiWeekUsageEntry[] >> {
    return this.http.get < ApiResult < ApiWeekUsageEntry[] >> (this.BASE_URL + '/weekUsage');
  }

  getTotalUsagePerDay(from: NgbDate, to?: NgbDate): Observable < ApiResult < {
    statistics: ApiStatistics,
    values: ApiTotalUsageEntry[]
  } >> {
    const toQueryParam = to ? '&to=' + ngbDateTimeToApiString(to) : '';
    const url = this.BASE_URL + '/totalUsagePerDay?from=' + ngbDateTimeToApiString(from) + toQueryParam;
    return this.http.get < ApiResult < {
      statistics: ApiStatistics,
      values: ApiTotalUsageEntry[]
    } >> (url);
  }

  getTotalUsageDistribution(
    fromDate: NgbDate, fromTime ? : NgbTimeStruct,
    toDate ? : NgbDate, toTime ? : NgbTimeStruct): Observable < ApiResult < ApiTotalDistributionEntry[] >> {
    const fromQueryParam = fromTime ? ngbDateTimeToApiString(fromDate, fromTime) : ngbDateTimeToApiString(fromDate);
    const toQueryParam = toDate ? '&to=' + (toTime ? ngbDateTimeToApiString(toDate, toTime) : ngbDateTimeToApiString(toDate)) : '';

    const url = this.BASE_URL + '/totalWattDistribution?from=' + fromQueryParam + toQueryParam;
    return this.http.get < ApiResult < ApiTotalDistributionEntry[] >> (url);
  }

  getMultipleTotalUsageDistributions(
    fromDates: NgbDate[],
    fromTimes: NgbTimeStruct[],
    toDates: NgbDate[],
    totimes: NgbTimeStruct[]): Observable<ApiResult<ApiMultipleTotalUsageDistributionEntry[]>> {
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

      return this.http.get<ApiResult<ApiMultipleTotalUsageDistributionEntry[]>>(url + JSON.stringify(queryParam));
    }
  }

  getFuseKwhPerInterval(
    interval: string, fromDate: NgbDate, fromTime?: NgbTimeStruct,
    toDate?: NgbDate, toTime?: NgbTimeStruct, intervalAmount = 1): Observable < ApiResult < ApiFuseKwhResult >> {
    const fromQueryParam = fromTime ? ngbDateTimeToApiString(fromDate, fromTime) : ngbDateTimeToApiString(fromDate);
    const toQueryParam = toDate ? '&to=' + (toTime ? ngbDateTimeToApiString(toDate, toTime) : ngbDateTimeToApiString(toDate)) : '';

    const url = this.BASE_URL + '/fusesKwhPerInterval?from=' + fromQueryParam + toQueryParam + '&interval=' +
      interval + '&intervalAmount=' + intervalAmount;
    return this.http.get < ApiResult < ApiFuseKwhResult >> (url);
  }


  getFusesKwh(
    fromDate: NgbDate, fromTime ?: NgbTimeStruct,
    toDate ?: NgbDate, toTime ?: NgbTimeStruct): Observable < ApiResult < ApiMultipleResults<any> >>  {

    const fromQueryParam = fromTime ? ngbDateTimeToApiString(fromDate, fromTime) : ngbDateTimeToApiString(fromDate);
    const toQueryParam = toDate ? '&to=' + (toTime ? ngbDateTimeToApiString(toDate, toTime) : ngbDateTimeToApiString(toDate)) : '';
    const url = this.BASE_URL + '/fusesKwh?from=' + fromQueryParam + toQueryParam;

    return this.http.get< ApiResult < ApiMultipleResults<any> >>(url);
  }


  getMultipleTotalKwh(
    fromDates: NgbDate[],
    fromTimes: NgbTimeStruct[],
    toDates: NgbDate[],
    totimes: NgbTimeStruct[]): Observable<ApiResult<ApiTotalUsageEntry[]>> {
    const length = fromDates.length;
    const url = this.BASE_URL + '/totalKwhMultiple?timeframes=';

    if (fromTimes.length !== length || toDates.length !== length || totimes.length !== length) {
      throw new Error('getMultipleTotalKwh parameters must be arrays of equal length.');
    } else {
      const queryParam = [];
      for (let i = 0; i < length; i++) {
        queryParam.push({
          from: ngbDateTimeToApiString(fromDates[i], fromTimes[i]),
          to: ngbDateTimeToApiString(toDates[i], totimes[i])
        });
      }

      return this.http.get<ApiResult<ApiTotalUsageEntry[]>>(url + JSON.stringify(queryParam));
    }
  }


}
