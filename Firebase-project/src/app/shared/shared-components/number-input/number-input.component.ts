import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit {

  @Input() placeHolder = '';

  public value: number;

  constructor() {}

  ngOnInit(): void {}

  public add(): void {
    if (this.value) {
      this.value += 1;
    } else {
      this.value = 1;
    }
  }

  public subtract(): void {
    if (this.value) {
      this.value -= 1;
    } else {
      this.value = -1;
    }
  }

  public checkValue() {
    if (!this.value) {
      this.value = 0;
    }
  }

  public getValue(): number {
    return this.value;
  }

}
