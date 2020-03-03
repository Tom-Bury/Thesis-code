import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import {
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormControl
} from '@angular/forms';
import {
  DateTimeRangeService
} from '../date-time-range.service';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Input() isFrom: boolean;
  public time: NgbTimeStruct;

  constructor(
    public datetimeRange: DateTimeRangeService
  ) {
    this.updateTime();
  }

  ngOnInit(): void {}

  public reset(): void {
    if (this.isFrom) {
      this.datetimeRange.clearTimeFrom();
    } else {
      this.datetimeRange.clearTimeTo();
    }
    this.updateTime();
  }

  public onChangeTime(newTime: NgbTimeStruct): void {
    if (this.isFrom) {
      this.datetimeRange.setTimeFrom(newTime);
    } else {
      this.datetimeRange.setTimeTo(newTime);
    }
    this.updateTime();
  }

  private updateTime(): void {
    if (this.isFrom) {
      this.time = this.datetimeRange.timeFrom;
    } else {
      this.time = this.datetimeRange.timeTo;
    }
  }

}
