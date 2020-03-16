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
  @Input() max: number = null;
  @Input() min: number = null;

  constructor() {}

  ngOnInit(): void {}

  public add(): void {
    const prevVal = this.parentForm.value[this.inputFieldName];
    const newValue = this.getProperNewValue(prevVal + 1);
    this.parentForm.patchValue({[this.inputFieldName]: newValue});
  }

  public subtract(): void {
    const prevVal = this.parentForm.value[this.inputFieldName];
    const newValue = this.getProperNewValue(prevVal - 1);
    this.parentForm.patchValue({[this.inputFieldName]: newValue});
  }

  public checkAndPatchNewValue() {
    const newValue = this.getProperNewValue(this.parentForm.value[this.inputFieldName]);
    this.parentForm.patchValue({[this.inputFieldName]: newValue});
  }

  public isMax(): boolean {
    if (this.max !== null) {
      return this.max === this.getProperNewValue(this.parentForm.value[this.inputFieldName]);
    } else {
      return false;
    }
  }

  public isMin(): boolean {
    if (this.min !== null) {
      return this.min === this.getProperNewValue(this.parentForm.value[this.inputFieldName]);
    } else {
      return false;
    }
  }

  private getProperNewValue(newValue) {
    if (newValue === null) {
      return this.min ? this.min : 0;
    }
    if (this.max !== null) {
      if (newValue > this.max) {
        return this.max;
      }
    }
    if (this.min !== null) {
      if (newValue < this.min) {
        return this.min;
      }
    }
    return newValue;
  }

}
