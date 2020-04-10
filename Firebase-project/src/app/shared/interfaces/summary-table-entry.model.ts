export class SummaryTableEntry {

  constructor(
    public name: string,
    public value: number,
    public metric: string,
    public useExtraValue: boolean
  ) {}


  public setValue(newVal: number): void {
    this.value = newVal;
  }

  public setName(newName: string): void {
    this.name = newName;
  }

}
