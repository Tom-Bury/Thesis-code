import { Component, OnInit, Input, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { ForumComment } from 'src/app/shared/interfaces/forum/forum-comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment: ForumComment;
  public toggleOpen = false;

  constructor() { }

  ngOnInit(): void {

  }


  toggleColorToDark() {
    document.getElementById('thread-toggle-icon' + this.comment.id).style.color = '#007bff'; // or dark grey #6c757d (_myTheme.scss);
    document.getElementById('thread-toggle-bar' + this.comment.id).style.backgroundColor = '#007bff';
  }

  toggleColorToLight() {
    document.getElementById('thread-toggle-icon' + this.comment.id).style.color = '#adb5bd'; // medium grey;
    document.getElementById('thread-toggle-bar' + this.comment.id).style.backgroundColor = '#adb5bd';
  }

  toggle() {
    this.toggleOpen = !this.toggleOpen;
  }

}
