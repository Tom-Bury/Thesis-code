import { Component, OnInit } from '@angular/core';
import { ChecklistItem } from '../../interfaces/checklist-item.model';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  checklistItems: ChecklistItem[] = [
    new ChecklistItem('Came by bike', 50, true),
    new ChecklistItem('Took stairs instead of elevator', 20, false),
    new ChecklistItem('Turned of monitor during breaks', 15, false),
    new ChecklistItem('Put on a sweater for the cold', 10, true),
    new ChecklistItem('Unplugged unused phone charger', 10, false),
    new ChecklistItem('Only cooked the amount of water I needed', 10, true),
    new ChecklistItem('Carpooled', 20, false),
    new ChecklistItem('Turned off unnecessary lights', 15, false)
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getColor(item: ChecklistItem): string {
    return item.isChecked ? 'primary' : 'unchecked';
  }

  toggle(item: ChecklistItem): void {
    item.isChecked = !item.isChecked;
  }

}
