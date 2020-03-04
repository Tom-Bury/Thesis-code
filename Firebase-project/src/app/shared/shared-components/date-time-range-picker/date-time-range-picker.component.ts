import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  NgbDate,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import {
  DateTimeRangeService
} from './date-time-range.service';
import * as moment from 'moment';
import {
  toNgbDate
} from '../../global-functions';


@Component({
  selector: 'app-date-time-range-picker',
  templateUrl: './date-time-range-picker.component.html',
  styleUrls: ['./date-time-range-picker.component.scss'],
  providers: [DateTimeRangeService]
})
export class DateTimeRangePickerComponent implements OnInit {

  @ViewChild('toggler', {
    static: false
  }) toggler: ElementRef;
  @Input() initialDateRange: NgbDate[] = [];
  @Input() initialTimeRange: NgbTimeStruct[] = [];
  @Input() activePresets: string[] = ['Today', 'This week', 'This month'];

  hoveredDate: NgbDate;
  isOpen = false;
  initialDate: NgbDate;
  presets: {name: string, dateRange: NgbDate[], timeRange: NgbTimeStruct[]}[] = [
    {
      name: 'Today',
      dateRange: [toNgbDate(moment())],
      timeRange: [{hour: 0, minute: 0, second: 0}, {hour: 23, minute: 59, second: 0}]
    },
    {
      name: 'This week',
      dateRange: [toNgbDate(moment().day(1)), toNgbDate(moment().day(7))],
      timeRange: [{hour: 0, minute: 0, second: 0}, {hour: 23, minute: 59, second: 0}]
    },
    {
      name: 'This month',
      dateRange: [toNgbDate(moment().startOf('month')), toNgbDate(moment().endOf('month'))],
      timeRange: [{hour: 0, minute: 0, second: 0}, {hour: 23, minute: 59, second: 0}]
    }
  ];


  constructor(
    public datetimeRange: DateTimeRangeService
  ) {}

  ngOnInit(): void {
    if (this.initialDateRange.length >= 1) {
      this.datetimeRange.selectDate(this.initialDateRange[0]);
      this.initialDate = this.initialDateRange[0];
      if (this.initialDateRange.length > 1) {
        this.datetimeRange.selectDate(this.initialDateRange[1]);
      }
    } else {
      this.initialDate = toNgbDate(moment());
    }

    if (this.initialTimeRange.length >= 1) {
      this.datetimeRange.setTimeFrom(this.initialTimeRange[0]);
      if (this.initialTimeRange.length > 1) {
        this.datetimeRange.setTimeTo(this.initialTimeRange[1]);
      }
    }
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


  clear(): void {
    this.datetimeRange.clear();
  }

  onDateSelection(date: NgbDate) {
    this.datetimeRange.selectDate(date);
  }

  selectPreset(preset: {name: string, dateRange: NgbDate[], timeRange: NgbTimeStruct[]}): void {
    this.clear();
    preset.dateRange.forEach(d => this.onDateSelection(d));
    if (preset.timeRange.length >= 1) {
      this.datetimeRange.setTimeFrom(preset.timeRange[0]);
      if (preset.timeRange.length > 1) {
        this.datetimeRange.setTimeTo(preset.timeRange[1]);
      }
    }
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
