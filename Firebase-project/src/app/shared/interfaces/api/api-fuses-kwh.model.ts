import { ApiResult } from './api-result.model';


interface ApiFusesKwhValue {
  timeFrom: string;
  timeTo: string;
  values: any; //  {fuseID1: number, fuseID2: number, ...}[]
}

export type ApiFusesKwh = ApiResult<ApiFusesKwhValue>;
