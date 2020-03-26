import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import { ngbDateTimeToApiString } from '../global-functions';
import * as moment from 'moment';

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

  public subtract(amount: number, key: any): DatetimeRange {
    const from = moment(ngbDateTimeToApiString(this.fromDate, this.fromTime), 'DD/MM/YYYY-HH:mm');
    const to = moment(ngbDateTimeToApiString(this.toDate, this.toTime), 'DD/MM/YYYY-HH:mm');

    const subFrom = from.subtract(amount, key);
    const subFromDate = new NgbDate(subFrom.year(), subFrom.month() + 1, subFrom.date());
    const subFromTime = {hour: subFrom.hour(), minute: subFrom.minute(), second: this.fromTime.second};

    const subTo = to.subtract(amount, key);
    const subToDate = new NgbDate(subTo.year(), subTo.month() + 1, subTo.date());
    const subToTime = {hour: subTo.hour(), minute: subTo.minute(), second: this.toTime.second};

    return new DatetimeRange(subFromDate, subFromTime, subToDate, subToTime);
  }


  public timeBetweenInSeconds(): number {
    const from = moment(ngbDateTimeToApiString(this.fromDate, this.fromTime), 'DD/MM/YYYY-HH:mm');
    const to = moment(ngbDateTimeToApiString(this.toDate, this.toTime), 'DD/MM/YYYY-HH:mm');
    return to.diff(from, 'second');
  }
}
