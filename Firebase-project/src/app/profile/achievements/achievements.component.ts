import { Component, OnInit } from '@angular/core';
import { Achievement } from 'src/app/shared/interfaces/achievement.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {

  achievements: Achievement[] = [];

  constructor(
    private currUser: UserService
  ) {
    if (currUser.userHasForumAccess()) {
      this.achievements = [
        new Achievement('First login ever!', 10, true, '15/03/2020'),
        new Achievement('Logged in each day of a work week', 15, true, '20/03/2020'),
        new Achievement('Logged in each day for 2 weeks straight', 30, false),
        new Achievement('Used each chart in the dashboard at least once', 50, false),
        new Achievement('First post put on the discussion board', 20, true, '28/03/2020'),
        new Achievement('Gained a comment on a post', 10, true, '28/03/2020'),
        new Achievement('Gained 5 comments on a post', 40, false),
        new Achievement('Gained 10 likes on a post', 20, false),
        new Achievement('Checked of actions in the checklist each day of a work week', 30, true, '27/03/2020'),
        new Achievement('Suggested a new checklist item', 30, false),
      ]
    } else {
      this.achievements = [
        new Achievement('First login ever!', 10, true, '15/03/2020'),
        new Achievement('Logged in each day of a work week', 15, true, '20/03/2020'),
        new Achievement('Logged in each day for 2 weeks straight', 30, false),
        new Achievement('Used each chart in the dashboard at least once', 50, false),
        new Achievement('Used a chart in the dashboard at least 10 times', 60, false),
        new Achievement('Checked of actions in the checklist each day of a work week', 30, true, '27/03/2020'),
        new Achievement('Suggested a new checklist item', 30, false),
      ]
    }
  }

  ngOnInit(): void {
  }

}
