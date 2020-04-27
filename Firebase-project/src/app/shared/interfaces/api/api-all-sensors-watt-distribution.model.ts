import { ApiResult } from './api-result.model';


export interface ApiAllSensorsWattDistributionEntry {
  sensorID: string;
  data: {
    date: string,
    dateMillis: number,
    value: number
  }[];
}


export interface ApiAllSensorsWattDistributionMain {
  timeFrom: string;
  timeTo: string;
  results: ApiAllSensorsWattDistributionEntry[];
}

export type ApiAllSensorsWattDistribution = ApiResult<ApiAllSensorsWattDistributionMain>;
