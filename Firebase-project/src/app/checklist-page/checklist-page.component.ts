import { Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { toNgbDate } from '../shared/global-functions';
import { FormBuilder, Validators } from '@angular/forms';
import { AutomaticPostCreationService } from '../shared/services/automatic-post-creation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checklist-page',
  templateUrl: './checklist-page.component.html',
  styleUrls: ['./checklist-page.component.scss']
})
export class ChecklistPageComponent implements OnInit {

  public initialDateRange: NgbDate[] = moment().day() === 0 ? [moment().day(-6), moment().day(0)].map(toNgbDate) :
  [moment().day(1), moment().day(7)].map(toNgbDate);
  public isAggregateByDay = true;

  public suggestionForm = this.fb.group({
    content: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private automaticPostSvc: AutomaticPostCreationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public aggregateByWeek(): void {
    this.isAggregateByDay = false;
  }

  public aggregateByDay(): void {
    this.isAggregateByDay = true;
  }

  public submitSuggestion(): void {
    if (this.suggestionForm.valid) {
      const title = 'I have a checklist suggestion!';
      const content =  'Why don\'t we add the following item to every checklist: \n' + this.suggestionForm.value.content + '\nGive a like if you agree!';
      this.automaticPostSvc.setPost(title, content, ['checklist']);
      this.router.navigate(['/forum']);
    }
  }

}
