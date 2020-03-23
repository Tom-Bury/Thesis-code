import { Component, OnInit } from '@angular/core';
import { ForumService } from '../shared/services/forum.service';
import { Observable, Subscription } from 'rxjs';
import { ForumPost } from '../shared/interfaces/forum/forum-post.model';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  public forumPosts: Observable<ForumPost[]>;

  constructor(
    private forumSvc: ForumService
  ) { }


  ngOnInit() {
    this.forumPosts = this.forumSvc.getAllPosts();
  }


}
