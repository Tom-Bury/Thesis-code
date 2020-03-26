import { ApiResult } from './api-result.model';


interface ApiSensorsKwhValue {
  timeFrom: string;
  timeTo: string;
  values: any; //  {sensorID: {fuse: string, value: number}}[]
}

export type ApiSensorsKwh = ApiResult<ApiSensorsKwhValue>;
