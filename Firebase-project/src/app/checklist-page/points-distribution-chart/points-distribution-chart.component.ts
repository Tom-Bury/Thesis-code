import { Component, OnInit, DoCheck } from '@angular/core';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';
import { COLORS } from 'src/app/shared/global-functions';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-points-distribution-chart',
  templateUrl: './points-distribution-chart.component.html',
  styleUrls: ['./points-distribution-chart.component.scss']
})
export class PointsDistributionChartComponent implements OnInit, DoCheck {


  private chartData: number[];
  private chartLabels: string[];
  public chartOptions: Partial<ChartOptions>;

  constructor(
    public currUser: UserService
  ) {
    this.chartData = currUser.userHasForumAccess() ?  [40, 25, 80, 15, 10] :  [40, 25, 90, 15];
    this.chartLabels = currUser.userHasForumAccess() ? ['Daily logins', 'Checklist', 'Discussion board activity', 'Dashboard usage', 'Achievements'] : ['Daily logins', 'Checklist', 'Dashboard usage', 'Achievements']
    this.chartData[1] = 25 + this.currUser.getUserScore() - 170;
  }

  ngDoCheck(): void {
    const newVal = 25 + this.currUser.getUserScore() - 170;

    if (this.chartData[1] !== newVal) {
      this.chartData[1] = newVal;
      this.chartOptions.series = [
        {
          name: 'You',
          data: this.chartData
        },
      ];
    }
  }

  ngOnInit(): void {
    this.chartOptions = {
      series: [
        {
          name: 'You',
          data: this.chartData
        },
      ],
      colors: [COLORS.$dark],
      chart: {
        type: 'bar',
        height: 180,
        toolbar: {
          show: false
        },
        fontFamily: 'Roboto, sans-serif',
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: true
      },
      xaxis: {
        categories: this.chartLabels,
        title: {
          text: 'Points',
          style: {
            fontWeight: 600
          }
        }
      },
      title: {
        text: 'Where you get your points from',
        align: 'left',
        style: {
          fontWeight: 600,
          fontFamily: 'inherit'
        }
      },
      tooltip: {
        enabled: false,
      }

    };
  }

}
