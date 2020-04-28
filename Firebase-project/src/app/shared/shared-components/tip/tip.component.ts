import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  animateCSS
} from '../../global-functions';
import {
  ChecklistItem
} from '../../interfaces/checklist-item.model';
import {
  TipsService
} from '../../services/tips.service';

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.scss']
})
export class TipComponent implements OnInit, AfterViewInit {

  @Input() tip: ChecklistItem;
  @Output() openChecklistOnTip = new EventEmitter < ChecklistItem > ();

  public show = true;

  constructor(
    private tipsSvc: TipsService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    animateCSS('#tip', 'bounceInDown', null);
  }

  public close(): void {
    animateCSS('#tip', 'bounceOutUp', () => {
      this.show = false;
    });
    setTimeout(() => {
      this.tipsSvc.consumeCurrentTip();
    }, 500);
  }

  public openChecklist(): void {
    this.openChecklistOnTip.emit();
    this.close();
  }

}
