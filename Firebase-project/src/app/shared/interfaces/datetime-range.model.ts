import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export class DatetimeRange {

  constructor(
    public fromDate: NgbDate,
    public fromTime: NgbTimeStruct,
    public toDate: NgbDate,
    public toTime: NgbTimeStruct
  ) {}

}
