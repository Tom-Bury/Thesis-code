import {
  Component,
  OnInit
} from '@angular/core';
import {
  NgbDateStruct,
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-date-time-range-picker',
  templateUrl: './date-time-range-picker.component.html',
  styleUrls: ['./date-time-range-picker.component.scss']
})
export class DateTimeRangePickerComponent implements OnInit {

  private dummyTime: NgbTimeStruct = {
    hour: 0,
    minute: 0,
    second: 0
  };

  pickedRange: string[] = ['from', 'to'];
  fromDate: NgbDate;
  fromTime: NgbTimeStruct = this.dummyTime;
  toDate: NgbDate;
  toTime: NgbTimeStruct = this.dummyTime;

  hoveredDate: NgbDate;


  constructor() {}

  ngOnInit(): void {}


  clear(): void {
    this.fromDate = null;
    this.toDate = null;
    this.pickedRange = ['from', 'to'];
  }

  submit(): void {
    if (this.fromDate) {
      this.pickedRange[0] = this.dateToString(this.fromDate, this.fromTime);

      if (this.toDate) {
        this.pickedRange[1] = this.dateToString(this.toDate, this.toTime);
      } else {
        this.pickedRange[1] = this.dateToString(this.fromDate, this.toTime);
      }
    } else {
      this.pickedRange = ['?', '?'];
    }
  }


  dateToString(date: NgbDate, time: NgbTimeStruct): string {
    const dateStr = date.day + '/' + date.month + '/' + date.year;
    const timeStr = time.hour + ':' + time.minute;
    return dateStr + ' @' + timeStr;
  }

  onFromTimeSelected(time: NgbTimeStruct): void {
    this.fromTime = time;
  }

  onToTimeSelected(time: NgbTimeStruct): void {
    this.toTime = time;
  }


  /**
   * Methods for adding / removing classes on the calendar element
   */

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  // From date is selected, hovering over to date. Used to color dates in between.
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  // From date & to date are selected. Used to color dates in between.
  isInRangeExclusive(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isInRangeInclusive(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInRangeExclusive(date);
  }


}
