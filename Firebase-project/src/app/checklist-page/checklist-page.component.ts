import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { toNgbDate } from '../shared/global-functions';
import { FormBuilder, Validators } from '@angular/forms';
import { AutomaticPostCreationService } from '../shared/services/automatic-post-creation.service';
import { Router } from '@angular/router';
import { AllUsersService } from '../shared/services/all-users.service';
import { ProgressBarChartComponent } from './progress-bar-chart/progress-bar-chart.component';
import { ProgressLineChartComponent } from './progress-line-chart/progress-line-chart.component';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-checklist-page',
  templateUrl: './checklist-page.component.html',
  styleUrls: ['./checklist-page.component.scss']
})
export class ChecklistPageComponent implements AfterViewInit {

  @ViewChild('barChart') barChart: ProgressBarChartComponent;
  @ViewChild('lineChart') lineChart: ProgressLineChartComponent;

  private justShownOne = false;

  public initialDateRange: NgbDate[] = moment().day() === 0 ? [moment().day(-6), moment().day(0)].map(toNgbDate) :
  [moment().day(1), moment().day(7)].map(toNgbDate);
  public isAggregateByDay = true;

  public suggestionForm = this.fb.group({
    content: ['', Validators.required]
  });

  public colleagues: string[] = [];
  public colleagueForm = this.fb.group({
    name: ['Nobody', []]
  });

  constructor(
    private fb: FormBuilder,
    private automaticPostSvc: AutomaticPostCreationService,
    private router: Router,
    private allUsers: AllUsersService,
    private currUser: UserService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.colleagues = this.allUsers.getAllUserNames();
    }, 1000);
  }

  public aggregateByWeek(): void {
    this.isAggregateByDay = false;
    alert('All data you see here are dummy values, so this button does not do anything meaningfull. This button would show the data week per week for the timeframe you selected.');
  }

  public aggregateByDay(): void {
    this.isAggregateByDay = true;
    alert('All data you see here are dummy values, so this button does not do anything meaningfull. This button would show the data day per day for the timeframe you selected.');
  }

  public submitSuggestion(): void {
    if (this.suggestionForm.valid && this.currUser.userHasForumAccess()) {
      const title = 'I have a checklist suggestion!';
      const content =  'Why don\'t we add the following item to every checklist: \n' + this.suggestionForm.value.content + '\nGive a like if you agree!';
      this.automaticPostSvc.setPost(title, content, ['checklist']);
      this.router.navigate(['/forum']);
    }
    if (!this.currUser.userHasForumAccess()) {
      alert('This would send your idea to the administrator, so you checklist suggestion will appear the next week in everyone\'s checklist.');
    }
  }

  public selectColleague(): void {
    const name = this.colleagueForm.value.name;
    if (name !== 'Nobody') {
      this.barChart.addRandomData(name);
      this.lineChart.addRandomData(name);
    } else {
      this.barChart.removeRandomData();
      this.lineChart.removeRandomData();
    }
  }

  public showDatetimeRangeSelectedAlert(): void {
    if (!this.justShownOne) {
      alert('This would alter the data you see in the below graphs. What you see right now are just dummy values.');
      this.justShownOne = true;
    } else {
      this.justShownOne = false;
    }
  }

}
