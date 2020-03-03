import {
  Component,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Output() timeSelected = new EventEmitter<NgbTimeStruct>();
  public time: NgbTimeStruct = {
    hour: 0,
    minute: 0,
    second: 0
  };

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
    this.timeSelected.emit(newTime);
  }

}
