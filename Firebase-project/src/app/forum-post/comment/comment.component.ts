import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import {
  ForumComment
} from 'src/app/shared/interfaces/forum/forum-comment.model';
import {
  Observable
} from 'rxjs';
import {
  ForumService
} from 'src/app/shared/services/forum.service';
import {
  AllUsersService
} from 'src/app/shared/services/all-users.service';
import {
  CommentLike
} from 'src/app/shared/interfaces/forum/comment-like.model';
import {
  UserService
} from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() commentID: string;
  @Output() openModal = new EventEmitter<string>();

  public toggleOpen = true;
  public comment$: Observable < ForumComment > ;
  public isHoveringMain = false;

  public modalCommentID: string;

  constructor(
    private forumSvc: ForumService,
    public allUsersSvc: AllUsersService,
    private currUser: UserService
  ) {}

  ngOnInit(): void {
    this.comment$ = this.forumSvc.getCommentObservable(this.commentID);
    this.modalCommentID = this.commentID;
  }


  toggleColorToDark() {
    document.getElementById('thread-toggle-icon' + this.commentID).style.color = '#007bff'; // or dark grey #6c757d (_myTheme.scss);
    document.getElementById('thread-toggle-bar' + this.commentID).style.backgroundColor = '#007bff';
  }

  toggleColorToLight() {
    document.getElementById('thread-toggle-icon' + this.commentID).style.color = '#adb5bd'; // medium grey;
    document.getElementById('thread-toggle-bar' + this.commentID).style.backgroundColor = '#adb5bd';
  }

  toggle() {
    this.toggleOpen = !this.toggleOpen;
  }


  public makeMainGrey() {
    document.getElementById('wrapper' + this.commentID).style.backgroundColor = '#f8f9fa'; // light grey;
  }

  public makeMainWhite() {
    document.getElementById('wrapper' + this.commentID).style.backgroundColor = '#fff';
  }


  public onClick(): void {
    if (this.isHoveringMain) {
      this.sendOpenModal(this.commentID);
    }
  }

  public sendOpenModal(cmtID: string): void {
    this.openModal.emit(cmtID);
  }

  public isLiked(): boolean {
    return this.currUser.userHasLikedComment(this.commentID) !== 'false';
  }

  public toggleCommentLike(): void {
    this.forumSvc.toggleLikeForComment(this.commentID);
  }


}
