import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';
import { COLORS } from 'src/app/shared/global-functions';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-points-distribution-chart',
  templateUrl: './points-distribution-chart.component.html',
  styleUrls: ['./points-distribution-chart.component.scss']
})
export class PointsDistributionChartComponent implements OnInit {

  private chartData: number[];
  private chartLabels: string[];
  public chartOptions: Partial<ChartOptions>;

  constructor(
    public currUser: UserService
  ) {
    this.chartData = currUser.userHasForumAccess() ?  [40, 25, 80, 15, 10] :  [40, 25, 90, 15];
    this.chartLabels = currUser.userHasForumAccess() ? ['Daily logins', 'Discussion board activity', 'Checklist', 'Dashboard usage', 'Achievements'] : ['Daily logins', 'Checklist', 'Dashboard usage', 'Achievements']
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
