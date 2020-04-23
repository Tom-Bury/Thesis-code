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

  private justOpened = true;

  constructor(
    private tipsSvc: TipsService
  ) {}

  ngOnInit(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutationRecord) => {
        const classes = (mutationRecord.target as any).className.split(' ');
        const isFading = !classes.includes('show');
        if (isFading && !this.justOpened) {
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
    setTimeout(() => {
      this.justOpened = false;
    }, 1000);
  }
}
