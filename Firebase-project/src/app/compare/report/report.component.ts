import {
  Component,
  OnInit
} from '@angular/core';

import {
  ChartOptions,
  ChartType,
  ChartDataSets
} from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {
  Label
} from 'ng2-charts';
import { DataFetcherService } from 'src/app/shared/services/data-fetcher.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public barChartLabels: Label[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [{
    data: [0, 0, 0, 0, 0, 0, 0],
    label: 'Total usage in kWh',
    backgroundColor: '#007bff',
    borderColor: '#180DFF',
    borderWidth: 0,
    hoverBackgroundColor: '#0C3CE8',
    hoverBorderColor: '#180DFF',
    hoverBorderWidth: 0,
  }, ];




  constructor(
    private dataFetcherSvc: DataFetcherService
  ) {}

  ngOnInit(): void {
    this.dataFetcherSvc.getWeekUsage().subscribe(
      (data) => {
        if (data.isError) {
          console.error('Error in fetching week usage data.', data.value);
          this.barChartData[0].data = [0, 0, 0, 0, 0, 0, 0];
        }
        else {
          this.barChartData[0].data = data.value.map(entry => entry.kwh);
        }
      }
    )
  }





}
