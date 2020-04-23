import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { animateCSS } from '../../global-functions';
import { ChecklistItem } from '../../interfaces/checklist-item.model';

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.scss']
})
export class TipComponent implements OnInit, AfterViewInit {

  @Input() tip: ChecklistItem;
  @Output() openChecklistOnTip = new EventEmitter<void>();

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

  public openChecklist(): void {
    this.openChecklistOnTip.emit();
  }

}
