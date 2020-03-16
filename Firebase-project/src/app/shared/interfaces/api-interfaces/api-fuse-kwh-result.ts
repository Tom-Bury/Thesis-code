export class ApiFuseKwhResult {

  constructor(
    public intervals: {from: string, to: string}[],
    public allFuseNames: string[],
    public fuseKwhs: any
  ) {}

}
