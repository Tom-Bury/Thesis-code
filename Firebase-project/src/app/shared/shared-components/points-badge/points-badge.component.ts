import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-points-badge',
  templateUrl: './points-badge.component.html',
  styleUrls: ['./points-badge.component.scss']
})
export class PointsBadgeComponent implements OnInit {

  @Input() amount: number;
  @Input() color = 'primary';

  constructor() { }

  ngOnInit(): void {
  }

}
