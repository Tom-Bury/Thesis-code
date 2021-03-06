import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
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
import { UserService } from 'src/app/shared/services/user.service';
import { TipsService } from 'src/app/shared/services/tips.service';


@Component({
  selector: 'app-verbruiksverloop',
  templateUrl: './verbruiksverloop.component.html',
  styleUrls: ['./verbruiksverloop.component.scss']
})
export class VerbruiksverloopComponent implements OnInit, AfterViewInit, OnDestroy {

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

  public initalDatetimeRange = new DatetimeRange(toNgbDate(moment('21/02/2020', 'DD/MM/YYYY').startOf('day')), {
    hour: 0,
    minute: 0,
    second: 0
  }, toNgbDate(moment('21/02/2020', 'DD/MM/YYYY').endOf('day')), {
    hour: 23,
    minute: 59,
    second: 0
  });

  public isLoading = false;
  public previousDatetimeRange: DatetimeRange;

  constructor(
    public currUser: UserService,
    private tipsSvc: TipsService
  ) {}

  ngOnInit(): void {
    this.tipsSvc.disableTips();
  }

  ngOnDestroy(): void {
    this.tipsSvc.disableTips();
  }

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
