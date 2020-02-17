import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public openChecklistModal(): void {
    document.getElementById('openModalBtn').click();
  }
}
