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

  public toString(): string {
    const fromDateStr = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
    const fromTimeStr = (this.fromTime.hour > 9 ? this.fromTime.hour : '0' + this.fromTime.hour) + ':' +
      (this.fromTime.minute > 9 ? this.fromTime.minute : '0' + this.fromTime.minute);
    const toDateStr = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
    const toTimeStr = (this.toTime.hour > 9 ? this.toTime.hour : '0' + this.toTime.hour) + ':' +
    (this.toTime.minute > 9 ? this.toTime.minute : '0' + this.toTime.minute);
    return fromDateStr + ' @' + fromTimeStr + ' to ' + toDateStr + ' @' + toTimeStr;
  }

}
