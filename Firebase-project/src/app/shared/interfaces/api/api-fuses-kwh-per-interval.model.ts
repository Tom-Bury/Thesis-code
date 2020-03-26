import { ApiResult } from './api-result.model';


interface ApiFusesKwhPerIntervalValue {
  timeframes: {
    timeFrom: string,
    timeTo: string
  }[];
  fusesResults: any;  // {fuseID1: number[], fuseID2: number[], ...}
}

export type ApiFusesKwhPerInterval = ApiResult<ApiFusesKwhPerIntervalValue>;
