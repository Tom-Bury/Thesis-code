import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-date-time-range-picker',
  templateUrl: './date-time-range-picker.component.html',
  styleUrls: ['./date-time-range-picker.component.scss']
})
export class DateTimeRangePickerComponent implements OnInit {

  pickedRange: string;


  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;

  constructor() { }

  ngOnInit(): void {
  }

  clear(): void {
    this.fromDate = null;
    this.toDate = null;
    this.pickedRange = null;
  }

  submit(): void {
    this.pickedRange = 'This was picked';
  }



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
