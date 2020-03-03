import {
  Injectable
} from '@angular/core';
import {
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DateTimeRangeService {

  private dummyTime: NgbTimeStruct = {
    hour: 0,
    minute: 0,
    second: 0
  };

  private dateFrom: NgbDate;
  private dateTo: NgbDate;

  public timeFrom: NgbTimeStruct = this.dummyTime;
  public timeTo: NgbTimeStruct = this.dummyTime;

  constructor() {}

  private dateTimeToString(date: NgbDate, time: NgbTimeStruct): string {
    const dateStr = date.day + '/' + date.month + '/' + date.year;
    const timeStr = time.hour + ':' + time.minute;
    return dateStr + ' @' + timeStr;
  }

  public getRangeStrings(): string[] {
    if (this.hasDateFrom()) {
      return [this.dateTimeToString(this.getDateFrom(), this.timeFrom), this.dateTimeToString(this.getDateTo(), this.timeTo)];
    } else {
      return ['from', 'to'];
    }
  }

  public clear(): void {
    this.dateFrom = null;
    this.timeFrom = this.dummyTime;
    this.dateTo = null;
    this.timeTo = this.dummyTime;
  }

  public selectDate(date: NgbDate): void {

    if (!this.hasDateFrom() && !this.hasDateTo()) {
      this.dateFrom = date;
    } else if (this.hasDateFrom() && !this.hasDateTo()) {

      if (date.after(this.dateFrom)) {
        this.dateTo = date;
      } else {
        this.dateFrom = date;
      }
    } else {
      this.dateFrom = date;
      this.dateTo = null;
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
    this.setTimeFrom(this.dummyTime);
  }

  public clearTimeTo(): void {
    this.setTimeTo(this.dummyTime);
  }

  public setTimeFrom(time: NgbTimeStruct): void {
    if (time === null) {
      this.timeFrom = this.dummyTime;
    } else {
      this.timeFrom = time;
    }
  }

  public setTimeTo(time: NgbTimeStruct): void {
    if (time === null) {
      this.timeTo = this.dummyTime;
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
