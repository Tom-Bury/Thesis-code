import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-hover',
  templateUrl: './info-hover.component.html',
  styleUrls: ['./info-hover.component.scss']
})
export class InfoHoverComponent implements OnInit {

  @Input() id: string;
  @Input() offsetX = 0;
  @Input() offsetY = 0;
  @Input() centerHorizontally = true;

  @Input() tooltipTitle: string;

  public tooltipShown = false;

  constructor() { }

  ngOnInit(): void {
  }

  showTooltip(): void {
    this.tooltipShown = true;

    window.onmousemove = (e) => {
      const tooltip = document.getElementById('tooltip-' + this.id);

      if (tooltip && this.tooltipShown) {

        let x = e.clientX + this.offsetX;
        const y = e.clientY + this.offsetY;

        if (this.centerHorizontally) {
          const ttWidth = tooltip.clientWidth;
          x -= Math.floor(ttWidth / 2);
        }

        tooltip.style.top = y + 'px';
        tooltip.style.left = x + 'px';
      }
    };
  }

  hideTooltip(): void {
    this.tooltipShown = false;
    window.onmousemove = null;
  }

}
