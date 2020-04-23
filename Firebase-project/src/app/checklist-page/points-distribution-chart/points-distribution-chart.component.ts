import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'src/app/shared/interfaces/chart-options.model';

@Component({
  selector: 'app-points-distribution-chart',
  templateUrl: './points-distribution-chart.component.html',
  styleUrls: ['./points-distribution-chart.component.scss']
})
export class PointsDistributionChartComponent implements OnInit {


  public chartOptions: Partial<ChartOptions>;
  public tooltipShown = false;

  constructor() { }


  ngOnInit(): void {
    this.chartOptions = {
      series: [
        {
          name: 'You',
          data: [40, 25, 90, 15]
        },
      ],
      chart: {
        type: 'bar',
        height: 180,
        toolbar: {
          show: false
        }
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
        categories: ['Daily logins', 'Discussion board activity', 'Checklist', 'Dashboard usage'],
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

  showTooltip(): void {
    this.tooltipShown = true;
    window.onmousemove = (e) => {
      const tooltip = document.getElementById('checklist-points-tooltip');
      if (tooltip && this.tooltipShown) {
        const ttWidth = tooltip.clientWidth;
        const xVal = (e.clientX) - Math.floor(ttWidth / 2);
        const x = xVal >= window.innerWidth - ttWidth - 25 ? window.innerWidth - ttWidth - 30 + 'px' : xVal + 'px';
        const y = (e.clientY) + 20 + 'px';
        tooltip.style.top = y;
        tooltip.style.left = x;
      }
    };
  }

  hideTooltip(): void {
    this.tooltipShown = false;
    window.onmousemove = null;
  }


}
