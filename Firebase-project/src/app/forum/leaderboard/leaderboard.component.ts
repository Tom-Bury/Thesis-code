import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';
import {
  User
} from 'src/app/shared/interfaces/user/user.model';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  public users: User[] = [
    new User('Benjamin', 1023),
    new User('Dries', 824),
    new User('Eva', 965),
    new User('Sarah', 124),
    new User('Hannah', 563),
    new User('Liesbeth', 1741),
    new User('Laurens', 1112),
  ];

  public isXLScreen = true;
  public isToggledOpen = false;

  constructor() {}

  ngOnInit(): void {
    this.users = this.users.sort(User.compareUsersByScore);
    this.isXLScreen = window.innerWidth >= 1200;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isXLScreen = window.innerWidth >= 1200;
  }



}
