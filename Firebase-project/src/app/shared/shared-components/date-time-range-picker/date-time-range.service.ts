import {
  Injectable
} from '@angular/core';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import {
  Subject
} from 'rxjs';
import {
  DatetimeRange
} from '../../interfaces/datetime-range.model';

@Injectable()
export class DateTimeRangeService {

  private dummyStartTime: NgbTimeStruct = {
    hour: 0,
    minute: 0,
    second: 0
  };
  private dummyEndTime: NgbTimeStruct = {
    hour: 23,
    minute: 59,
    second: 0
  };


  private dateFrom: NgbDate;
  private dateTo: NgbDate;

  public timeFrom: NgbTimeStruct = this.dummyStartTime;
  public timeTo: NgbTimeStruct = this.dummyStartTime;

  public timeFromChangedExternally = new Subject < NgbTimeStruct > ();
  public timeToChangedExternally = new Subject < NgbTimeStruct > ();

  constructor() {}

  private dateTimeToString(date: NgbDate, time: NgbTimeStruct): string {
    const dateStr = date.day + '/' + date.month + '/' + date.year;
    const timeStr = (time.hour <= 9 ? '0' + time.hour : time.hour) + ':' + (time.minute <= 9 ? '0' + time.minute : time.minute);
    return dateStr + ' @' + timeStr;
  }

  public getRangeStrings(): string[] {
    if (this.hasDateFrom()) {
      return [this.dateTimeToString(this.getDateFrom(), this.timeFrom), this.dateTimeToString(this.getDateTo(), this.timeTo)];
    } else {
      return ['from', 'to'];
    }
  }

  public getDatetimeRange(): DatetimeRange {
    if (!this.isValid()) {
      throw new Error('Try to getDatetimeRange but is invalid.');
    } else {
      return new DatetimeRange(this.getDateFrom(), this.timeFrom, this.getDateTo(), this.timeTo);
    }
  }

  public clear(): void {
    this.dateFrom = null;
    this.timeFrom = this.dummyStartTime;
    this.dateTo = null;
    this.timeTo = this.dummyStartTime;
  }

  public selectDate(date: NgbDate): void {

    if (!this.hasDateFrom() && !this.hasDateTo()) {
      this.dateFrom = date;
      this.setTimeFrom(this.dummyStartTime);
      this.setTimeTo(this.dummyEndTime);
      this.timeFromChangedExternally.next(this.dummyStartTime);
      this.timeToChangedExternally.next(this.dummyEndTime);
    } else if (this.hasDateFrom() && !this.hasDateTo()) {

      if (date.after(this.dateFrom)) {
        this.dateTo = date;
      } else {
        this.dateFrom = date;
      }
    } else {
      this.dateFrom = date;
      this.dateTo = null;
      this.setTimeFrom(this.dummyStartTime);
      this.setTimeTo(this.dummyEndTime);
      this.timeFromChangedExternally.next(this.dummyStartTime);
      this.timeToChangedExternally.next(this.dummyEndTime);
    }
  }

  public hasDateFrom(): boolean {
    return this.dateFrom ? true : false;
  }

  public isAfterDateFrom(date: NgbDate): boolean {
    return this.dateFrom && date.after(this.dateFrom);
  }

  public hasDateTo(): boolean {
    return this.dateTo ? true : false;
  }



  public isInRangeExclusive(date: NgbDate) {
    return date.after(this.dateFrom) && date.before(this.dateTo);
  }

  public isInRangeInclusive(date: NgbDate) {
    return date.equals(this.dateFrom) || date.equals(this.dateTo) || this.isInRangeExclusive(date);
  }

  private getDateFrom(): NgbDate {
    return this.dateFrom;
  }

  private getDateTo(): NgbDate {
    if (this.hasDateTo()) {
      return this.dateTo;
    } else {
      return this.dateFrom;
    }
  }


  public clearTimeFrom(): void {
    this.setTimeFrom(this.dummyStartTime);
  }

  public clearTimeTo(): void {
    this.setTimeTo(this.dummyStartTime);
  }

  public setTimeFrom(time: NgbTimeStruct): void {
    if (time === null) {
      this.timeFrom = this.dummyStartTime;
    } else {
      this.timeFrom = time;
    }
  }

  public setTimeTo(time: NgbTimeStruct): void {
    if (time === null) {
      this.timeTo = this.dummyStartTime;
    } else {
      this.timeTo = time;
    }
  }

  public isValid(): boolean {
    if (!this.hasDateFrom()) {
      return false;
    }

    if (this.hasDateFrom() && !this.hasDateTo()) {
      return this.timeFrom.hour < this.timeTo.hour ||
        (this.timeFrom.hour === this.timeTo.hour && this.timeFrom.minute < this.timeTo.minute);
    } else {
      return true;
    }
  }



}
