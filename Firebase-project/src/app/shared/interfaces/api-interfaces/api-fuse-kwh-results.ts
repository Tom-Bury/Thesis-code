import { ApiFuseKwhEntry } from './api-fuse-kwh-entry.model';

export class ApiFuseKwhResults {

  constructor(
    public timeFrom: string,
    public timeTo: string,
    public fuses: ApiFuseKwhEntry[]
  ) {}

}
