export class SummaryTableEntry {

  constructor(
    public name: string,
    public value: number,
    public metric: string,
    public useExtraValue: boolean,
    public date = ''
  ) {}


  public setValue(newVal: number): void {
    this.value = newVal;
  }

  public setDate(newDate: string): void {
    this.date = newDate;
  }

}
