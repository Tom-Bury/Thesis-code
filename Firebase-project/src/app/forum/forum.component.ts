import { Component, OnInit } from '@angular/core';
import { ForumService } from '../shared/services/forum.service';
import { Observable } from 'rxjs';
import { ForumPost } from '../shared/interfaces/forum/forum-post.model';
import { AllUsersService } from '../shared/services/all-users.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  public forumPosts$: Observable<ForumPost[]>;

  constructor(
    private forumSvc: ForumService,
    private allUsersSvc: AllUsersService
  ) { }


  ngOnInit() {
    this.forumPosts$ = this.forumSvc.getMostRecentPosts(2);
    this.allUsersSvc.refresh();
  }


}
