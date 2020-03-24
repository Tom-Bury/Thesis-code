import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ForumComment } from 'src/app/shared/interfaces/forum/forum-comment.model';
import { Observable } from 'rxjs';
import { ForumService } from 'src/app/shared/services/forum.service';
import { AllUsersService } from 'src/app/shared/services/all-users.service';

declare let $: any;

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @ViewChild('modal') modal: ElementRef;

  @Input() commentID: string;

  public toggleOpen = false;
  public comment$: Observable<ForumComment>;
  public isHoveringMain = false;

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


  public makeMainGrey() {
    document.getElementById('wrapper' + this.commentID).style.backgroundColor = '#f8f9fa'; // light grey;
  }

  public makeMainWhite() {
    document.getElementById('wrapper' + this.commentID).style.backgroundColor = '#fff';
  }


  public onClick(): void {
    if (this.isHoveringMain) {
       $(this.modal.nativeElement).modal('show');
    }
  }

}
