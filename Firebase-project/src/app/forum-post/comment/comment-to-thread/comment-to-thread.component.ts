import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ForumComment } from 'src/app/shared/interfaces/forum/forum-comment.model';
import { AllUsersService } from 'src/app/shared/services/all-users.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-to-thread',
  templateUrl: './comment-to-thread.component.html',
  styleUrls: ['./comment-to-thread.component.scss']
})
export class CommentToThreadComponent implements OnInit {

  @Input() comment$: Observable<ForumComment>;
  public commentForm = this.fb.group({
    content: ['', Validators.required]
  });

  constructor(
    public allUsersSvc: AllUsersService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  public submitComment(): void {

  }

}
