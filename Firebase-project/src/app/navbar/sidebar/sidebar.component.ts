import {
  Component,
  OnInit,
} from '@angular/core';
import { TipsService } from 'src/app/shared/services/tips.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private tipsSvc: TipsService
  ) {}

  ngOnInit(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutationRecord) => {
        const classes = (mutationRecord.target as any).className.split(' ');
        console.log(classes)
        const isFading = !classes.includes('show');
        if (isFading) {
          this.tipsSvc.setCurrentTip(null);
        }
      });
    });

    const target = document.getElementById('checklistModal');
    observer.observe(target, {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  public openChecklistModal(): void {
    document.getElementById('openModalBtn').click();
  }
}
