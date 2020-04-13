import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  toNgbDate
} from 'src/app/shared/global-functions';
import {
  DatetimeRange
} from 'src/app/shared/interfaces/datetime-range.model';
import * as moment from 'moment';
import {
  LineChartComponent
} from './line-chart/line-chart.component';
import { FuseHeatmapComponent } from './fuse-heatmap/fuse-heatmap.component';
import { ShareButtonComponent } from 'src/app/shared/shared-components/share-button/share-button.component';


@Component({
  selector: 'app-verbruiksverloop',
  templateUrl: './verbruiksverloop.component.html',
  styleUrls: ['./verbruiksverloop.component.scss']
})
export class VerbruiksverloopComponent implements OnInit, AfterViewInit {

  @ViewChild('lineChart') lineChart: LineChartComponent;
  @ViewChild('heatMap') heatMap: FuseHeatmapComponent;
  @ViewChild('shareBtn') shareBtn: ShareButtonComponent;

  // public initialDateRange: NgbDate[] = [moment().startOf('day'), moment().endOf('day')].map(toNgbDate);
  // public initialTimeRange: NgbTimeStruct[] = [{
  //   hour: 0,
  //   minute: 0,
  //   second: 0
  // }, {
  //   hour: 23,
  //   minute: 59,
  //   second: 0
  // }];

  public initalDatetimeRange = new DatetimeRange(toNgbDate(moment().startOf('day')), {
    hour: 0,
    minute: 0,
    second: 0
  }, toNgbDate(moment().endOf('day')), {
    hour: 23,
    minute: 59,
    second: 0
  });

  public isLoading = false;
  public previousDatetimeRange: DatetimeRange;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.updateForRange(this.initalDatetimeRange);
  }

  updateForRange(newRange: DatetimeRange): void {
    if (!newRange.equals(this.previousDatetimeRange)) {
      this.previousDatetimeRange = newRange;
      this.lineChart.updateForRange(newRange);
      this.heatMap.updateForRange(newRange);
    }
  }

  shareLineChart(): void {
    this.lineChart.shareChart(this.shareBtn);
  }

  shareHeatmap(): void {
    this.heatMap.shareChart(this.shareBtn);
  }
}
