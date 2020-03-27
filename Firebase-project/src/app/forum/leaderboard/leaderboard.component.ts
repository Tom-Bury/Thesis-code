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

  constructor(
    private allUsers: AllUsersService,
    private currUser: UserService
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



}
