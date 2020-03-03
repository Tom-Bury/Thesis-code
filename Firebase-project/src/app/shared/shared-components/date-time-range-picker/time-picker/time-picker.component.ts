import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit, OnDestroy {

  private dummyTime: NgbTimeStruct = {
    hour: 0,
    minute: 0,
    second: 0
  };

  @Input() initialTime = this.dummyTime;
  @Output() timeSelected = new EventEmitter < NgbTimeStruct > ();

  @Input() timeChangedExternallyEvt: Subject<NgbTimeStruct>;
  private timeChangedExternallyEvtSubscription: Subscription;

  public time: NgbTimeStruct;


  constructor() {}

  ngOnInit(): void {
    this.time = this.initialTime;
    if (this.timeChangedExternallyEvt) {
      this.timeChangedExternallyEvtSubscription = this.timeChangedExternallyEvt.subscribe(
        newTime => this.time = newTime
      );
    }
  }

  ngOnDestroy(): void {
    if (this.timeChangedExternallyEvtSubscription) {
      this.timeChangedExternallyEvtSubscription.unsubscribe();
    }
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
