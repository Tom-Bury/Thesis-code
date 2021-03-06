import {
  Component,
  OnInit,
} from '@angular/core';
import { TipsService } from 'src/app/shared/services/tips.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private justOpened = true;

  constructor(
    private tipsSvc: TipsService,
    public currUser: UserService
  ) {}

  ngOnInit(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutationRecord) => {
        const classes = (mutationRecord.target as any).className.split(' ');
        const isFading = !classes.includes('show');
        if (isFading && !this.justOpened) {
          this.tipsSvc.enableTips();
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
    document.getElementById('checklist-modal-btn').click();
    this.tipsSvc.disableTips();
    setTimeout(() => {
      this.justOpened = false;
    }, 1000);
  }

  public getWattHoursScore(): number {
    return 135 + this.tipsSvc.getExtraWhs();
  }
}
