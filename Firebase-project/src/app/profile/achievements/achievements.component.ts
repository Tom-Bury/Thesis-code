import { Component, OnInit } from '@angular/core';
import { Achievement } from 'src/app/shared/interfaces/achievement.model';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {

  achievements: Achievement[] = [
    new Achievement('First login ever!', 10, true),
    new Achievement('Logged in each day of a work week', 15, true),
    new Achievement('Logged in each day for 2 weeks straight', 30, false),
    new Achievement('First post put on forum', 20, true),
    new Achievement('Gained 10 likes on a forum post', 20, false),
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
