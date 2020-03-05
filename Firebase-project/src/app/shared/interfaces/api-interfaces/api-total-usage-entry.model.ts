export class ApiTotalUsageEntry {

  constructor(
    public timeFrom: string,
    public timeTo: string,
    public kwh: number
  ) {}

}
