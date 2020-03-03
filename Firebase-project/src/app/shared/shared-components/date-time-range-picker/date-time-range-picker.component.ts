import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  NgbDateStruct,
  NgbDate,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import { DateTimeRangeService } from './date-time-range.service';
@Component({
  selector: 'app-date-time-range-picker',
  templateUrl: './date-time-range-picker.component.html',
  styleUrls: ['./date-time-range-picker.component.scss'],
  providers: [DateTimeRangeService]
})
export class DateTimeRangePickerComponent implements OnInit {

  @ViewChild('toggler', {static: false}) toggler: ElementRef;

  hoveredDate: NgbDate;
  isOpen = false;


  constructor(
    public datetimeRange: DateTimeRangeService
  ) {}

  ngOnInit(): void {}


  clear(): void {
    this.datetimeRange.clear();
  }

  submit(): void {
    this.closeCollapse();
  }

  closeCollapse(): void {
    if (this.isOpen) {
      this.toggler.nativeElement.click();
    }
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  onDateSelection(date: NgbDate) {
    this.datetimeRange.selectDate(date);
  }

  /**
   * Methods for adding / removing classes on the calendar element
   */

  // From date is selected, hovering over to date. Used to color dates in between.
  isHovered(date: NgbDate) {
    return this.datetimeRange.hasDateFrom() && !this.datetimeRange.hasDateTo() &&
      this.hoveredDate && this.datetimeRange.isAfterDateFrom(date) && date.before(this.hoveredDate);
  }

  // From date & to date are selected. Used to color dates in between.
  isInRangeExclusive(date: NgbDate) {
    return this.datetimeRange.isInRangeExclusive(date);
  }

  isInRangeInclusive(date: NgbDate) {
    return this.datetimeRange.isInRangeInclusive(date);
  }

}
