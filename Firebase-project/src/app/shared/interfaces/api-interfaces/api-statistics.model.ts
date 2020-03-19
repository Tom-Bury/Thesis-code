import { ApiTotalUsageEntry } from './api-total-usage-entry.model';

export class ApiStatistics {

  constructor(
    public totalAvg: number,
    public weekdayAvg: number,
    public max: ApiTotalUsageEntry,
    public min: ApiTotalUsageEntry
  ) {}

}
