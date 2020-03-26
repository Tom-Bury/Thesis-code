import { ApiResult } from './api-result.model';


interface ApiTotalWattDistributionValue {
  date: string;
  dateMillis: number;
  value: number;
}

export type ApiTotalWattDistribution = ApiResult<ApiTotalWattDistributionValue[]>;
