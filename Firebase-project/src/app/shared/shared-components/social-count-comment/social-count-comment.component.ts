import { Component, OnInit, Input } from '@angular/core';
import { ForumComment } from '../../interfaces/forum-comment.model';

@Component({
  selector: 'app-social-count-comment',
  templateUrl: './social-count-comment.component.html',
  styleUrls: ['./social-count-comment.component.scss']
})
export class SocialCountCommentComponent implements OnInit {

  @Input() comment: ForumComment;

  constructor() { }

  ngOnInit(): void {
  }

}
