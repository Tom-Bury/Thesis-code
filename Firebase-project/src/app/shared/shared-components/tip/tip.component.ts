import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { animateCSS } from '../../global-functions';
import { Tip } from '../../interfaces/tip.model';

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.scss']
})
export class TipComponent implements OnInit, AfterViewInit {

  @Input() tip: Tip;

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
