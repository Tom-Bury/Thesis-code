import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexFill,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexNoData,
  ApexStroke,
  ApexGrid,
  ApexResponsive,
  ApexMarkers
} from 'ng-apexcharts';

export interface ChartOptions {
  series: ApexAxisChartSeries | number[];
  chart: ApexChart;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  labels: string[];
  subTitle: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  colors: string[];
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  noData: ApexNoData;
  responsive: ApexResponsive;
  markers: ApexMarkers;
}
