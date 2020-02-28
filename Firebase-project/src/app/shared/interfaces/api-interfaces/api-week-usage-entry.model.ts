export class ApiWeekUsageEntry {

  constructor(
    public dayName: string,
    public timeFrom: string,
    public timeTo: string,
    public kwh: number
  ) {}

}
