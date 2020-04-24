import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import {
  ChecklistItem
} from '../../interfaces/checklist-item.model';
import {
  TipsService
} from '../../services/tips.service';
import {
  animateCSS
} from '../../global-functions';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  checklistItems: ChecklistItem[] = [];

  constructor(
    private tipsSvc: TipsService
  ) {}

  ngOnInit(): void {
    this.checklistItems = this.tipsSvc.getChecklistItems();
  }


  getColor(item: ChecklistItem): string {
    return item.isChecked ? 'primary' : 'unchecked';
  }

  toggle(item: ChecklistItem): void {
    item.isChecked = !item.isChecked;
    if (item.isChecked) {
      document.getElementById('checklist-item-' + this.stringHash(item.name)).classList.add('checked');
    }
  }

  isHighlighted(item: ChecklistItem): boolean {
    if (this.tipsSvc.hasCurrentTip()) {
      return this.tipsSvc.getCurrentTip().name === item.name;
    }
    return false;
  }

  stringHash(str: string) {
    let hash = 0;
    let i = 0;
    let chr = 0;

    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;

  }

}
