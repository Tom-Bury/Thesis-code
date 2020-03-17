import { Component, OnInit } from '@angular/core';
import { SummaryTableEntry } from 'src/app/shared/interfaces/summary-table-entry.model';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  currWeekAverage = 32.15;

  summaryEntries: SummaryTableEntry[] = [
    new SummaryTableEntry('Today\'s total usage so far', 12.36, 'kWh', false),
    new SummaryTableEntry('This week\'s average usage', 32.15, 'kWh', false),
    new SummaryTableEntry('Yesterday\'s total usage', 38.47, 'kWh', true),
    new SummaryTableEntry('Best day this week', 27.99, 'kWh', true),
  ];
  public showOtherMetric: number = null;

  constructor() { }

  ngOnInit(): void {
  }

  calculatePercentageString(entry: SummaryTableEntry): string {
    const percentage = this.calculatePercentage(entry);
    const prefix = percentage > 0 ? '+' : '';
    return prefix + percentage.toFixed(2);
  }

  calculatePercentage(entry: SummaryTableEntry): number {
    const result = 100 * (entry.value / this.currWeekAverage) - 100;
    return result;
  }
}
