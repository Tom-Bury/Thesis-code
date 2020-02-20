import { Component, OnInit, Input } from '@angular/core';
import { ForumPost } from '../../interfaces/forum-post.model';

@Component({
  selector: 'app-social-count',
  templateUrl: './social-count.component.html',
  styleUrls: ['./social-count.component.scss']
})
export class SocialCountComponent implements OnInit {

  @Input() post: ForumPost;

  constructor() { }

  ngOnInit(): void {
  }

}
