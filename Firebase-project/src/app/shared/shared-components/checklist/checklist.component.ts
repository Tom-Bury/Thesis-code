import { Component, OnInit } from '@angular/core';
import { ChecklistItem } from '../../interfaces/checklist-item.model';
import { TipsService } from '../../services/tips.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  checklistItems: ChecklistItem[] = [];

  constructor(
    private tipsSvc: TipsService
  ) { }

  ngOnInit(): void {
    this.checklistItems = this.tipsSvc.getChecklistItems();
  }

  getColor(item: ChecklistItem): string {
    return item.isChecked ? 'primary' : 'unchecked';
  }

  toggle(item: ChecklistItem): void {
    item.isChecked = !item.isChecked;
  }

}
