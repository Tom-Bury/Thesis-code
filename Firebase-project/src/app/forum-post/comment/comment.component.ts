import { Component, OnInit, Input } from '@angular/core';
import { ForumComment } from 'src/app/shared/interfaces/forum/forum-comment.model';
import { Observable } from 'rxjs';
import { ForumService } from 'src/app/shared/services/forum.service';
import { AllUsersService } from 'src/app/shared/services/all-users.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() commentID: string;

  public toggleOpen = false;
  public comment$: Observable<ForumComment>;

  constructor(
    private forumSvc: ForumService,
    public allUsersSvc: AllUsersService
  ) { }

  ngOnInit(): void {
    this.comment$ = this.forumSvc.getCommentObservable(this.commentID);
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

}
