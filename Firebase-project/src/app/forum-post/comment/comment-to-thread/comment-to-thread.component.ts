import {
  Component,
  OnInit,
  Input
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

@Component({
  selector: 'app-comment-to-thread',
  templateUrl: './comment-to-thread.component.html',
  styleUrls: ['./comment-to-thread.component.scss']
})
export class CommentToThreadComponent implements OnInit {

  @Input() comment$: Observable < ForumComment > ;
  @Input() currCommentID: string;
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
  }

  public submitComment(): void {
    if (this.commentForm.valid) {
      const content = this.commentForm.value.content;
      const newComment = new ForumComment(this.currUser.getUID(), content, this.currCommentID);
      this.forumSvc.submitCommentForComment(this.currCommentID, newComment);
      this.commentForm.reset();
    }
  }
}
