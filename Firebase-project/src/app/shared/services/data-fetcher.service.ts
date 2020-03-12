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
  ApiFuseKwhResults
} from '../interfaces/api-interfaces/api-fuse-kwh-results';

@Injectable({
  providedIn: 'root'
})
export class DataFetcherService {

  private BASE_URL = environment.apiBaseUrl;

  constructor(
    private http: HttpClient
  ) {}

  getWeekUsage(): Observable < ApiResult < ApiWeekUsageEntry[] >> {
    return this.http.get < ApiResult < ApiWeekUsageEntry[] >> (this.BASE_URL + '/weekUsage');
  }

  getTotalUsagePerDay(from: NgbDate, to ?: NgbDate): Observable < ApiResult < {
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
    fromDate: NgbDate, fromTime ?: NgbTimeStruct,
    toDate ?: NgbDate, toTime ?: NgbTimeStruct): Observable < ApiResult < ApiTotalDistributionEntry[] >> {
    const fromQueryParam = fromTime ? ngbDateTimeToApiString(fromDate, fromTime) : ngbDateTimeToApiString(fromDate);
    const toQueryParam = toDate ? '&to=' + (toTime ? ngbDateTimeToApiString(toDate, toTime) : ngbDateTimeToApiString(toDate)) : '';

    const url = this.BASE_URL + '/totalWattDistribution?from=' + fromQueryParam + toQueryParam;
    return this.http.get < ApiResult < ApiTotalDistributionEntry[] >> (url);
  }

  getFuseKwhPerInterval(
    interval: string, fromDate: NgbDate, fromTime ?: NgbTimeStruct,
    toDate ?: NgbDate, toTime ?: NgbTimeStruct): Observable < ApiResult < ApiFuseKwhResults[] >> {
    const fromQueryParam = fromTime ? ngbDateTimeToApiString(fromDate, fromTime) : ngbDateTimeToApiString(fromDate);
    const toQueryParam = toDate ? '&to=' + (toTime ? ngbDateTimeToApiString(toDate, toTime) : ngbDateTimeToApiString(toDate)) : '';

    const url = this.BASE_URL + '/fusesKwhPerInterval?from=' + fromQueryParam + toQueryParam + '&interval=' + interval;
    return this.http.get < ApiResult < ApiFuseKwhResults[] >> (url);
  }


  getFuseKwh(
    fuseName: string, fromDate: NgbDate, fromTime ?: NgbTimeStruct,
    toDate ?: NgbDate, toTime ?: NgbTimeStruct): Observable < ApiResult < ApiTotalUsageEntry >>  {

    const fromQueryParam = fromTime ? ngbDateTimeToApiString(fromDate, fromTime) : ngbDateTimeToApiString(fromDate);
    const toQueryParam = toDate ? '&to=' + (toTime ? ngbDateTimeToApiString(toDate, toTime) : ngbDateTimeToApiString(toDate)) : '';
    const url = this.BASE_URL + '/fuseKwh?from=' + fromQueryParam + toQueryParam + '&fuse=' + fuseName;

    return this.http.get<ApiResult<ApiTotalUsageEntry>>(url);
  }
}
