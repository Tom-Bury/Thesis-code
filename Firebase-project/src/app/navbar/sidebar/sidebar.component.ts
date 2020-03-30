import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public openChecklistModal(): void {
    document.getElementById('openModalBtn').click();
    // TODO: if not already on checklist page?
  }
}
