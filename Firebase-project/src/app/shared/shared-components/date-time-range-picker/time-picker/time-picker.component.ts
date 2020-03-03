import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Output() timeSelected = new EventEmitter<{valid: boolean, time: NgbTimeStruct}>();
  @Input() before: NgbTimeStruct;
  @Input() after: NgbTimeStruct;


  public time: NgbTimeStruct = {
    hour: 0,
    minute: 0,
    second: 0
  };

  public ctrl = new FormControl('', (control: FormControl) => {
    const time = control.value as NgbTimeStruct;
    let returnVal = null;

    if (!time) {
      returnVal = null;
    }
    else {
      if (this.before) {
        if (time.hour > this.before.hour || (time.hour === this.before.hour && time.minute >= this.before.minute)) {
          returnVal = {tooLate: true};
        }
      }
      if (this.after) {
        if (time.hour < this.after.hour || (time.hour === this.after.hour && time.minute <= this.after.minute)) {
          returnVal = {tooEarly: true};
        }
      }
    }

    return returnVal;
  });

  constructor() {}

  ngOnInit(): void {}

  reset(): void {
    this.time = {
      hour: 0,
      minute: 0,
      second: 0
    };
  }

  onChangeTime(newTime: NgbTimeStruct) {
    this.timeSelected.emit({
      valid: this.ctrl.valid,
      time: newTime
    });
  }

}
