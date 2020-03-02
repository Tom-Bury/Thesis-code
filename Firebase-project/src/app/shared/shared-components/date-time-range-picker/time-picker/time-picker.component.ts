import {
  Component,
  OnInit
} from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  public time: NgbTimeStruct = {
    hour: 0,
    minute: 0,
    second: 0
  }

  constructor() {}

  ngOnInit(): void {}

  reset(): void {
    this.time = {
      hour: 0,
      minute: 0,
      second: 0
    };
  }

}
