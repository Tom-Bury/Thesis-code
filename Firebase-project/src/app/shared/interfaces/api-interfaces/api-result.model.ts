export class ApiResult<T> {

  constructor(
    public isError: boolean,
    public value: T
  ) {}

}
