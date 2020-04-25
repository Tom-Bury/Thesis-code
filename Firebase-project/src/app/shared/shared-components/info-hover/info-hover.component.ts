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
  @Input() iconClass = 'default';

  @Input() tooltipTitle: string;

  public tooltipShown = false;

  constructor() { }

  ngOnInit(): void {
  }

  showTooltip(): void {
    window.onmousemove = (e) => {
      const tooltip = document.getElementById('tooltip-' + this.id);


      if (tooltip) {

        let x = e.clientX + this.offsetX;
        const y = e.clientY + this.offsetY;
        const ttWidth = tooltip.offsetWidth;
        const windowWidth = window.innerWidth;

        if (this.centerHorizontally) {
          x -= Math.floor(ttWidth / 2);
        }

        if (x >= windowWidth - ttWidth - 25 ) {
          x = windowWidth - ttWidth - 35;
        }

        tooltip.style.top = y + 'px';
        tooltip.style.left = x + 'px';

        if (!this.tooltipShown) {
          tooltip.style.top = -1000 + 'px';
          tooltip.style.left = -1000 + 'px';
        }


        this.tooltipShown = true;
      }
    };
  }

  hideTooltip(): void {
    this.tooltipShown = false;
    window.onmousemove = null;
  }

}
