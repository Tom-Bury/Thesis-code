import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() inputFieldName: string;

  constructor() {}

  ngOnInit(): void {}

  public add(): void {
    const prevVal = this.parentForm.value[this.inputFieldName];
    this.parentForm.patchValue({[this.inputFieldName]: prevVal + 1});
  }

  public subtract(): void {
    const prevVal = this.parentForm.value[this.inputFieldName];
    this.parentForm.patchValue({[this.inputFieldName]: prevVal - 1});
  }

  public checkValue() {
    const prevVal = this.parentForm.value[this.inputFieldName];
    if (!prevVal) {
      this.parentForm.patchValue({[this.inputFieldName]: 0});
    }
  }

}
