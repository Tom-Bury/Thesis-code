import {
  Component,
  OnInit,
} from '@angular/core';
import {
  SummaryTableEntry
} from 'src/app/shared/interfaces/summary-table-entry.model';
import {
  DataFetcherService
} from 'src/app/shared/services/data-fetcher.service';
import * as moment from 'moment';
import {
  toNgbDate
} from 'src/app/shared/global-functions';
import {
  KwhCalculatorService
} from 'src/app/shared/services/kwh-calculator.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  public currWeekAverage = 0;

  private isLoading1 = true;
  private isLoading2 = true;

  private currWeek = moment().day() === 0 ? [moment().subtract(2, 'months').day(-6), moment().subtract(2, 'months').day(0)].map(toNgbDate) : [moment().subtract(2, 'months').day(1), moment().subtract(2, 'months').day(7)].map(toNgbDate);
  private yesterdayToday = [moment().subtract(2, 'months').subtract(1, 'd'), moment().subtract(2, 'months')].map(toNgbDate);

  summaryEntries: SummaryTableEntry[] = [
    new SummaryTableEntry('Today\'s total usage so far', 0, 'kWh', false, -1),
    new SummaryTableEntry('This week\'s average usage', 0, 'kWh', false, -1),
    new SummaryTableEntry('Yesterday\'s total usage', 0, 'kWh', true, -1),
    new SummaryTableEntry('Best day this week', 0, 'kWh', true, -1),
    new SummaryTableEntry('Worst day this week', 0, 'kWh', true, -1)
  ];


  private currentComparisonIndex = 0;
  public currentComparisonName: string;
  public currentComparisonExplanation: string;
  public currentComparisonMetric: string;


  constructor(
    private dataFetcherSvc: DataFetcherService,
    private kwhCalculator: KwhCalculatorService
  ) {
    this.currentComparisonName = kwhCalculator.getCalcName(0);
    this.currentComparisonExplanation = this.kwhCalculator.getCalcExplanation(0);
    this.currentComparisonMetric = this.kwhCalculator.getCalcMetric(0);
  }

  ngOnInit(): void {
    this.isLoading1 = true;
    this.isLoading2 = true;

    this.dataFetcherSvc.getTotalUsagePerDay(this.currWeek[0], this.currWeek[1])
      .subscribe(
        data => {
          if (!data.isError) {
            const values = data.value.values;


            // AVERAGE
            const numbers = values.map(v => v.value).filter(v => v > 0);
            this.currWeekAverage = this.roundToThreeDecimalPoints(numbers.reduce((a, b) => a + b) / numbers.length);
            this.summaryEntries[1].setValue(this.currWeekAverage);
            this.setAlternateValue(this.summaryEntries[1]);


            // MIN & MAX
            let max = 0;
            let maxDay = '';
            let min = Number.MAX_VALUE;
            let minDay = '';
            const todayIndex = numbers.length - 1;
            const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

            values.forEach((v, i) => {
              const date = weekdays[moment(v.timeFrom).isoWeekday()];
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

            this.summaryEntries[3].setName('Best day this week: ' + minDay);
            this.summaryEntries[3].setValue(this.roundToThreeDecimalPoints(min));
            this.setAlternateValue(this.summaryEntries[3]);

            this.summaryEntries[4].setName('Worst day this week: ' + maxDay);
            this.summaryEntries[4].setValue(this.roundToThreeDecimalPoints(max));
            this.setAlternateValue(this.summaryEntries[4]);
          }
        },
        error => {
          console.error('Could not fetch total usage per day.', error);
        },
        () => this.isLoading1 = false
      );

    this.dataFetcherSvc.getTotalUsagePerDay(this.yesterdayToday[0], this.yesterdayToday[1])
      .subscribe(
        data => {
          if (!data.isError && data.value.values.length === 2) {
            const values = data.value.values;
            this.summaryEntries[0].setValue(values[1].value);
            this.setAlternateValue(this.summaryEntries[0]);

            this.summaryEntries[2].setValue(values[0].value);
            this.setAlternateValue(this.summaryEntries[2]);
          }
        },
        error => {
          console.error('Could not fetch total usage for today & yesterday.', error);
        },
        () => this.isLoading2 = false
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


  changeComparison(): void {
    this.currentComparisonIndex += 1;
    this.currentComparisonName = this.kwhCalculator.getCalcName(this.currentComparisonIndex);
    this.currentComparisonExplanation = this.kwhCalculator.getCalcExplanation(this.currentComparisonIndex);
    this.currentComparisonMetric = this.kwhCalculator.getCalcMetric(this.currentComparisonIndex);
    this.summaryEntries.forEach(se => this.setAlternateValue(se));
  }

  private setAlternateValue(entry: SummaryTableEntry): void {
    const alternateValue = this.kwhCalculator.getCalculation(entry.value, this.currentComparisonIndex);
    entry.setAlternateValue(alternateValue);
  }



  isLoading(): boolean {
    return this.isLoading1 && this.isLoading2;
  }

  private roundToThreeDecimalPoints(n: number): number {
    return Math.round((n + Number.EPSILON) * 1000) / 1000;
  }

}
