import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';
import { AllUsersService } from 'src/app/shared/services/all-users.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  public ranking: {name: string, uid: string, score: number}[] = [];

  public isXLScreen = true;
  public isToggledOpen = false;

  public tooltipShown = false;

  constructor(
    private allUsers: AllUsersService,
    public currUser: UserService
  ) {}

  ngOnInit(): void {
    this.ranking = this.allUsers.getRanking();
    this.isXLScreen = window.innerWidth >= 1200;

  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isXLScreen = window.innerWidth >= 1200;
  }

  public isCurrentUser(uid: string): boolean {
    return uid === this.currUser.getUID();
  }

  public isPreviousWinner(uid: string): boolean {
    return uid === 'x1DdlwcTutdXzIuYLC2282MSsgx1';
  }


  showTooltip(): void {
    this.tooltipShown = true;
    window.onmousemove = (e) => {
      const tooltip = document.getElementById('leaderboard-tooltip');
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
