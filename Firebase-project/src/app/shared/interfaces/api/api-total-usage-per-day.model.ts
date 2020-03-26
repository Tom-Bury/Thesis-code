import { ApiValue } from './api-value.model';
import { ApiResult } from './api-result.model';
import { ApiMultipleTotalUsageDistributionEntry } from '../api-interfaces/api-multiple-total-distribution-entry.model';

export interface ApiTotalUsagePerDayStatistics {
  totalAvg: number;
  weekdayAvg: number;
  max: ApiValue;
  min: ApiValue;
}

interface ApiTotalUsagePerDayValue {
  statistics: ApiTotalUsagePerDayStatistics;
  values: ApiValue[];
}

export type ApiTotalUsagePerDay = ApiResult<ApiTotalUsagePerDayValue>;
