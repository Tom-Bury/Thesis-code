import { Component, OnInit } from '@angular/core';
import { SummaryTableEntry } from 'src/app/shared/interfaces/summary-table-entry.model';
import { DataFetcherService } from 'src/app/shared/services/data-fetcher.service';
import * as moment from 'moment';
import { toNgbDate } from 'src/app/shared/global-functions';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  public currWeekAverage = 0;

  private currWeek = moment().day() === 0 ? [moment().day(-6), moment().day(0)].map(toNgbDate) :
  [moment().day(1), moment().day(7)].map(toNgbDate);
  private yesterdayToday = [moment().subtract(1, 'd'), moment()].map(toNgbDate);

  summaryEntries: SummaryTableEntry[] = [
    new SummaryTableEntry('Today\'s total usage so far', 0, 'kWh', false),
    new SummaryTableEntry('This week\'s average usage', 0, 'kWh', false),
    new SummaryTableEntry('Yesterday\'s total usage', 0, 'kWh', true),
    new SummaryTableEntry('Best day this week', 0, 'kWh', true),
    new SummaryTableEntry('Worst day this week', 0, 'kWh', true)
  ];
  public showOtherMetric: number = null;

  constructor(
    private dataFetcherSvc: DataFetcherService
  ) { }

  ngOnInit(): void {
    this.dataFetcherSvc.getTotalUsagePerDay(this.currWeek[0], this.currWeek[1])
      .subscribe(
        data => {
          if (!data.isError) {
            const values = data.value.values;

            // AVERAGE
            const numbers = values.map(v => v.value).filter(v => v > 0);
            this.currWeekAverage = this.roundToThreeDecimalPoints(numbers.reduce((a, b) => a + b) / numbers.length);
            this.summaryEntries[1].setValue(this.currWeekAverage);


            // MIN & MAX
            let max = 0;
            let maxDay = '';
            let min = Number.MAX_VALUE;
            let minDay = '';
            const todayIndex = numbers.length - 1;

            values.forEach((v, i) => {
              const date = v.timeFrom + ' - ' + v.timeTo;
              const amount = v.value;

              if (amount >= max) {
                max = amount;
                maxDay = date;
              }
              if (amount <= min && amount > 0 && i !== todayIndex) {
                min = amount;
                minDay = date;
              }
            });

            this.summaryEntries[3].setDate(minDay);
            this.summaryEntries[3].setValue(this.roundToThreeDecimalPoints(min));

            this.summaryEntries[4].setDate(maxDay);
            this.summaryEntries[4].setValue(this.roundToThreeDecimalPoints(max));

          }
        },
        error => {
          console.error('Could not fetch total usage per day.', error);
        }
      );

    this.dataFetcherSvc.getTotalUsagePerDay(this.yesterdayToday[0], this.yesterdayToday[1])
        .subscribe(
          data => {
            if (!data.isError && data.value.values.length === 2) {
              const values = data.value.values;
              this.summaryEntries[0].setValue(values[1].value);
              this.summaryEntries[0].setDate(values[1].timeFrom + ' - ' + values[1].timeTo);

              this.summaryEntries[2].setValue(values[0].value);
              this.summaryEntries[2].setDate(values[0].timeFrom + ' - ' + values[0].timeTo);
            }
          },
          error => {
            console.error('Could not fetch total usage for today & yesterday.', error);
          }
        );
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

  private roundToThreeDecimalPoints(n: number): number {
    return Math.round((n + Number.EPSILON) * 1000) / 1000;
  }
}
