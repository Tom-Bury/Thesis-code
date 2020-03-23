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
    new User('Benjamin'),
    new User('Dries'),
    new User('Eva'),
    new User('Sarah'),
    new User('Hannah'),
    new User('Liesbeth'),
    new User('Laurens'),
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
