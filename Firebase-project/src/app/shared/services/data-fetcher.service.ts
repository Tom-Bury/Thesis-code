import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResult } from '../interfaces/api-interfaces/api-result.model';
import { ApiWeekUsageEntry } from '../interfaces/api-interfaces/api-week-usage-entry.model';
import { Observable } from 'rxjs';

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
}
