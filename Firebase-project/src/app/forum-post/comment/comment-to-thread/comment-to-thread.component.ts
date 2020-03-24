import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  Observable
} from 'rxjs';
import {
  ForumComment
} from 'src/app/shared/interfaces/forum/forum-comment.model';
import {
  AllUsersService
} from 'src/app/shared/services/all-users.service';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  UserService
} from 'src/app/shared/services/user.service';
import {
  ForumService
} from 'src/app/shared/services/forum.service';
import { ForumPost } from 'src/app/shared/interfaces/forum/forum-post.model';

@Component({
  selector: 'app-comment-to-thread',
  templateUrl: './comment-to-thread.component.html',
  styleUrls: ['./comment-to-thread.component.scss']
})
export class CommentToThreadComponent implements OnInit {

  @Input() comment$: Observable < ForumComment > ;
  @Input() currCommentID: string;
  @Output() commentSubmitted = new EventEmitter<void>();

  public subComments$: Observable<ForumComment[]>;

  public commentForm = this.fb.group({
    content: ['', Validators.required]
  });

  constructor(
    public allUsersSvc: AllUsersService,
    private fb: FormBuilder,
    private currUser: UserService,
    private forumSvc: ForumService
  ) {
  }

  ngOnInit(): void {
    this.comment$.subscribe(comment => {
      if (comment.comments.length > 0) {
        this.subComments$ = this.forumSvc.getCommentsObservable(comment.comments);
      }
    });
  }

  public submitComment(): void {
    if (this.commentForm.valid) {
      const content = this.commentForm.value.content;
      const newComment = new ForumComment(this.currUser.getUID(), content, this.currCommentID);
      this.forumSvc.submitCommentForComment(this.currCommentID, newComment);
      this.commentForm.reset();
      this.commentSubmitted.emit();
    }
  }
}
