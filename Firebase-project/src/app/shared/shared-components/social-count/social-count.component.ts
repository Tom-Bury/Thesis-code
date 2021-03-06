import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ForumPost } from '../../interfaces/forum/forum-post.model';
import { ForumComment } from '../../interfaces/forum/forum-comment.model';

@Component({
  selector: 'app-social-count',
  templateUrl: './social-count.component.html',
  styleUrls: ['./social-count.component.scss']
})
export class SocialCountComponent implements OnInit {

  @Input() onDarkBackground = false;

  @Input() liked = false;
  @Input() postOrComment: ForumPost | ForumComment;

  @Output() likePressed =  new EventEmitter<void>();
  @Output() commentPressed = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  public onLikeClick(): void {
    this.likePressed.emit();
  }

  public onCommentClick(): void {
    this.commentPressed.emit();
  }

}
