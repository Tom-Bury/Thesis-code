import { Component, OnInit, Input } from '@angular/core';
import { COLORS } from 'src/app/shared/global-functions';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  @Input() color = COLORS.$dark;

  constructor() { }

  ngOnInit(): void {
  }

}
