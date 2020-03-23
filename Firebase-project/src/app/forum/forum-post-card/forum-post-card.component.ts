import { Component, OnInit, Input } from '@angular/core';
import { ForumPost } from 'src/app/shared/interfaces/forum/forum-post.model';

@Component({
  selector: 'app-forum-post-card',
  templateUrl: './forum-post-card.component.html',
  styleUrls: ['./forum-post-card.component.scss']
})
export class ForumPostCardComponent implements OnInit {

  @Input() post: ForumPost;

  constructor() { }

  ngOnInit(): void {
  }

}
