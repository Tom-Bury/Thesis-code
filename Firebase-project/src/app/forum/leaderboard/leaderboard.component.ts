import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user.model';

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
    new User('Liesbeth', 741),
    new User('Laurens', 1112),
  ];

  constructor() { }

  ngOnInit(): void {
    this.users = this.users.sort(User.compareUsersByScore);
  }


}
