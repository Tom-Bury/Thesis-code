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
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [{
    data: [65, 59, 80, 81, 56, 55, 40],
    label: 'Total usage in kWh',
    backgroundColor: '#007bff',
    borderColor: '#180DFF',
    borderWidth: 0,
    hoverBackgroundColor: '#0C3CE8',
    hoverBorderColor: '#180DFF',
    hoverBorderWidth: 0,
  }, ];




  constructor() {}

  ngOnInit(): void {}





}
