import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';
import { UserPublic } from 'src/app/shared/interfaces/user/user-public.model';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  public users: UserPublic[] = [];

  public isXLScreen = true;
  public isToggledOpen = false;

  constructor() {}

  ngOnInit(): void {
    this.users = this.users.sort(UserPublic.compareUsersByScore);
    this.isXLScreen = window.innerWidth >= 1200;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isXLScreen = window.innerWidth >= 1200;
  }



}
