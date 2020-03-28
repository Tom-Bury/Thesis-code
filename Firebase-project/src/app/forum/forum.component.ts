import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  ForumService
} from '../shared/services/forum.service';
import {
  Observable
} from 'rxjs';
import {
  ForumPost
} from '../shared/interfaces/forum/forum-post.model';
import {
  AllUsersService
} from '../shared/services/all-users.service';
import { PreviousLoadedPostsService } from './previous-loaded-posts.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit, OnDestroy {

  public forumPosts: ForumPost[] = [];
  public fetchedAll = false;
  public fetching = false;

  constructor(
    private forumSvc: ForumService,
    private allUsersSvc: AllUsersService,
    private previousLoadedPostsSvc: PreviousLoadedPostsService
  ) {}


  ngOnInit(): void {
    this.forumPosts = this.previousLoadedPostsSvc.getPreviouslyLoadedPosts();
    this.fetchedAll = this.previousLoadedPostsSvc.canLoadMore();

    if (this.forumPosts.length === 0) {

      this.fetching = true;
      this.allUsersSvc.refresh();

      this.forumSvc.getMostRecentPosts(2, true)
        .then(posts => {
          this.forumPosts = posts;
          if (posts.length === 0) {
            this.fetchedAll = true;
          }
        })
        .catch(err => {
          console.error('Could not fetch posts: ', err);
          this.forumPosts = [];
        })
        .finally(() => this.fetching = false);
    }
  }

  ngOnDestroy(): void {
    this.previousLoadedPostsSvc.savePosts(this.forumPosts);
  }

 public fetchMorePosts(): void {
    if (!this.fetchedAll && !this.fetching) {
      this.fetching = true;
      this.forumSvc.getMostRecentPosts(2)
        .then(posts => {
          if (posts.length > 0) {
            this.forumPosts = this.forumPosts.concat(posts);
          } else {
            this.fetchedAll = true;
            this.previousLoadedPostsSvc.hasLoadedAll();
          }
        })
        .catch(err => {
          console.error('Could not fetch additional posts: ', err);
          this.fetchedAll = true;
          this.previousLoadedPostsSvc.hasLoadedAll();
        })
        .finally(() => this.fetching = false);
    }
  }

}
