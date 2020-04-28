import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  Observable,
  Subscription,
  Subject
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
import {
  ForumPost
} from 'src/app/shared/interfaces/forum/forum-post.model';
import {
  CommentLike
} from 'src/app/shared/interfaces/forum/comment-like.model';

@Component({
  selector: 'app-comment-to-thread',
  templateUrl: './comment-to-thread.component.html',
  styleUrls: ['./comment-to-thread.component.scss']
})
export class CommentToThreadComponent implements OnInit, OnDestroy {

  @Input() mainCommentID: Subject < string > ;
  @Output() commentSubmitted = new EventEmitter < void > ();
  @ViewChild('mainCommentTextArea') mainCommentTextArea: ElementRef;

  public commentFormHighlighted = true;

  public subComments$: Observable < ForumComment[] > ;
  public comment$: Observable < ForumComment > ;

  private currCommentID: string;
  public hasSubComments = false;

  public commentForm = this.fb.group({
    content: ['', Validators.required]
  });



  constructor(
    public allUsersSvc: AllUsersService,
    private fb: FormBuilder,
    private currUser: UserService,
    private forumSvc: ForumService
  ) {}

  ngOnDestroy(): void {
    this.mainCommentID.unsubscribe();
  }

  ngOnInit(): void {
    this.mainCommentID.subscribe(cmtID => {
      this.currCommentID = cmtID;
      this.comment$ = this.forumSvc.getCommentObservable(cmtID);
      this.comment$.subscribe(comment => {
        if (comment.comments.length > 0) {
          this.subComments$ = this.forumSvc.getCommentsObservable(comment.comments);
          this.hasSubComments = true;
        } else {
          this.subComments$ = null;
          this.hasSubComments = false;
        }
      });
    });
  }

  public focus(): void {
    setTimeout(() => {
      this.mainCommentTextArea.nativeElement.focus();
    }, 500);
  }

  public submitComment(): void {
    if (this.commentForm.valid && this.currCommentID) {
      const content = this.commentForm.value.content;
      const newComment = new ForumComment(this.currUser.getUID(), content, this.currCommentID);
      this.forumSvc.submitCommentForComment(this.currCommentID, newComment);
      this.commentForm.reset();
      this.commentSubmitted.emit();
    }
  }

  public hasLikedSubcomment(subCmntID: string): boolean {
    return this.currUser.userHasLikedComment(subCmntID) !== 'false';
  }

  public toggleLikeSubcomment(subCmtID: string): void {
    this.forumSvc.toggleLikeForComment(subCmtID);
  }

  public openOtherCommentThreadModal(subCmntID: string): void {
    this.mainCommentID.next(subCmntID);
  }
}
