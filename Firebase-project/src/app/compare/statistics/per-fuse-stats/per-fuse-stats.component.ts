import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-per-fuse-stats',
  templateUrl: './per-fuse-stats.component.html',
  styleUrls: ['./per-fuse-stats.component.scss']
})
export class PerFuseStatsComponent implements OnInit {

  public isOpened = false;
  @Input() id = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
