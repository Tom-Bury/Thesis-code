import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';

export class DatetimeRange {

  constructor(
    public fromDate: NgbDate,
    public fromTime: NgbTimeStruct,
    public toDate: NgbDate,
    public toTime: NgbTimeStruct
  ) {}

  public equals(other: DatetimeRange): boolean {
    if (other) {
      return this.fromDate.equals(other.fromDate) &&
        this.fromTime.hour === other.fromTime.hour &&
        this.fromTime.minute === other.fromTime.minute &&
        this.toDate.equals(other.toDate) &&
        this.toTime.hour === other.toTime.hour &&
        this.toTime.minute === other.toTime.minute;
    } else {
      return false;
    }

  }

}
