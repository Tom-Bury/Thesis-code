export class ApiMultipleResults<T> {

  constructor(
    public timeFrom: string,
    public timeTo: string,
    public values: T[]
  ) {}

}
