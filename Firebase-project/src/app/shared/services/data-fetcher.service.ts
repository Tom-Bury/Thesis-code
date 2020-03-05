import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResult } from '../interfaces/api-interfaces/api-result.model';
import { ApiWeekUsageEntry } from '../interfaces/api-interfaces/api-week-usage-entry.model';
import { Observable } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ngbDateTimeToApiString } from '../global-functions';
import { ApiTotalUsageEntry } from '../interfaces/api-interfaces/api-total-usage-entry.model';
import { ApiStatistics } from '../interfaces/api-interfaces/api-statistics.model';

@Injectable({
  providedIn: 'root'
})
export class DataFetcherService {

  private BASE_URL = environment.apiBaseUrl;

  constructor(
    private http: HttpClient
  ) { }

  getWeekUsage(): Observable<ApiResult<ApiWeekUsageEntry[]>> {
    return this.http.get<ApiResult<ApiWeekUsageEntry[]>>(this.BASE_URL + '/weekUsage');
  }

  getTotalUsagePerDay(from: NgbDate, to?: NgbDate): Observable<ApiResult<{statistics: ApiStatistics, values: ApiTotalUsageEntry[]}>> {
    const toQueryParam = to ? '&to=' + ngbDateTimeToApiString(to) : '';
    const url = this.BASE_URL + '/totalUsagePerDay?from=' + ngbDateTimeToApiString(from) + toQueryParam;
    return this.http.get<ApiResult<{statistics: ApiStatistics, values: ApiTotalUsageEntry[]}>>(url);
  }
}
