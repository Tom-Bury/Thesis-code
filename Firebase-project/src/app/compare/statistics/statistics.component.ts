import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  @Input() initDateRange: NgbDate[] = [];

  constructor() {}

  ngOnInit(): void {}
}
