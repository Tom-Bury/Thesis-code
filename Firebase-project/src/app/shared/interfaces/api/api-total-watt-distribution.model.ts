import { ApiResult } from './api-result.model';


interface ApiTotalWattDistributionMultipleSingleValue {
  date: string;
  dateMillis: number;
  value: number;
}


interface ApiTotalWattDistributionMultipleValue {
  timeFrom: string;
  timeTo: string;
  values: ApiTotalWattDistributionMultipleSingleValue[];
}

export type ApiTotalWattDistributionMultiple = ApiResult<ApiTotalWattDistributionMultipleValue[]>;
