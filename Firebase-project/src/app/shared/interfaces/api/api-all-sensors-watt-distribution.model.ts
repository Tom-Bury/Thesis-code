import { ApiResult } from './api-result.model';


interface ApiAllSensorsWattDistributionEntry {
  sesorID: string;
  data: {
    date: string,
    dateMillis: number,
    value: number
  };
}


interface ApiAllSensorsWattDistributionMain {
  timeFrom: string;
  timeTo: string;
  results: ApiAllSensorsWattDistributionEntry[];
}

export type ApiAllSensorsWattDistribution = ApiResult<ApiAllSensorsWattDistributionMain>;
