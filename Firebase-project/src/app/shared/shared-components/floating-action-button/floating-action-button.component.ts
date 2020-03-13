import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-floating-action-button',
  templateUrl: './floating-action-button.component.html',
  styleUrls: ['./floating-action-button.component.scss']
})
export class FloatingActionButtonComponent implements OnInit {

  @Input() mainButton = 'cogs';
  @Input() mainButtonName = '';
  @Input() mainButtonSize = 50;
  @Input() mainIconSize = 16;
  @Input() subButtonIcons: string[] = [];
  @Input() subButtonNames: string[] = [];
  @Input() subButtonSize = 30;
  @Input() subIconSize = 16;
  @Output() mainButtonPressed = new EventEmitter<void>();
  @Output() subButtonPressed = new EventEmitter<number>();

  public open = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggle(): void {
    this.mainButtonPressed.emit();
    this.open = !this.open;
  }

  onClick(i: number): void {
    this.subButtonPressed.emit(i);
    this.toggle();
  }

}
