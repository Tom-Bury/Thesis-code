import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import {
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  private dummyTime: NgbTimeStruct = {
    hour: 0,
    minute: 0,
    second: 0
  };

  @Input() initialTime = this.dummyTime;
  @Output() timeSelected = new EventEmitter < NgbTimeStruct > ();

  public time: NgbTimeStruct;


  constructor() {}

  ngOnInit(): void {
    this.time = this.initialTime;
  }

  public reset(): void {
    this.time = this.dummyTime;
    this.timeSelected.emit(this.dummyTime);
  }

  public onChangeTime(newTime: NgbTimeStruct): void {
    this.time = newTime;
    this.timeSelected.emit(newTime);
  }
}
