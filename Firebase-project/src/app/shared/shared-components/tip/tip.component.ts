import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { animateCSS } from '../../global-functions';

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.scss']
})
export class TipComponent implements OnInit, AfterViewInit {

  public show = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    animateCSS('#tip', 'bounceInDown', null);
  }

  public close(): void {
    animateCSS('#tip', 'bounceOutUp', () => {
      this.show = false;
    });
  }

}
