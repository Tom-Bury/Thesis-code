import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-floating-action-button',
  templateUrl: './floating-action-button.component.html',
  styleUrls: ['./floating-action-button.component.scss']
})
export class FloatingActionButtonComponent implements OnInit {

  public open = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggle(): void {
    this.open = !this.open;
  }

}
