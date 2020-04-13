import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChartToImageService } from '../../services/chart-to-image.service';
import { ChartComponent } from 'ng-apexcharts';
import { PreviousLoadedPostsService } from 'src/app/forum/previous-loaded-posts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss']
})
export class ShareButtonComponent implements OnInit {

  @Output() public shareClicked = new EventEmitter<void>();

  constructor(
    private chartToImgSvc: ChartToImageService,
    private shareChartSvc: PreviousLoadedPostsService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public shareChart(chart: ChartComponent): void {
    this.chartToImgSvc.chartToFile(chart)
      .then(f => {
        this.shareChartSvc.setOpenCreatePostFile(f);
        this.router.navigate(['forum']);
      });
  }

}
