import { ApiTotalDistributionEntry } from './api-total-distribution-entry.model';

export class ApiMultipleTotalUsageDistributionEntry {

  constructor(
    public timeFrom: string,
    public timeTo: string,
    public values: ApiTotalDistributionEntry[]
  ) {}

}
