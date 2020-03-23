import { Component, OnInit, Input } from '@angular/core';
import { ForumPost } from '../../interfaces/forum/forum-post.model';
import { ForumComment } from '../../interfaces/forum/forum-comment.model';

@Component({
  selector: 'app-social-count',
  templateUrl: './social-count.component.html',
  styleUrls: ['./social-count.component.scss']
})
export class SocialCountComponent implements OnInit {

  @Input() liked = false;
  @Input() postOrComment: ForumPost | ForumComment;

  constructor() { }

  ngOnInit(): void {
  }

}
