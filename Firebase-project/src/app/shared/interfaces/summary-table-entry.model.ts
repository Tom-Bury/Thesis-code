export class SummaryTableEntry {

  constructor(
    public name: string,
    public value: number,
    public metric: string,
    public showPercentage: boolean,
    public alternateValue: number
  ) {}


  public setValue(newVal: number): void {
    this.value = newVal;
  }

  public setName(newName: string): void {
    this.name = newName;
  }

  public setAlternateValue(v: number): void {
    this.alternateValue = v;
  }

}
