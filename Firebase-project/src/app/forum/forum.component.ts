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
import {
  PreviousLoadedPostsService
} from './previous-loaded-posts.service';
import { SortOption } from './sort-option.enum';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit, OnDestroy {

  public forumPosts: ForumPost[] = [];
  public fetchedAll = false;
  public fetching = false;

  private sortOption: SortOption;

  constructor(
    private forumSvc: ForumService,
    private previousLoadedPostsSvc: PreviousLoadedPostsService
  ) {}


  ngOnInit(): void {
    this.forumPosts = this.previousLoadedPostsSvc.getPreviouslyLoadedPosts();
    this.fetchedAll = this.previousLoadedPostsSvc.canLoadMore();
    this.sortOption = this.previousLoadedPostsSvc.getPreviousSortOption();

    if (this.forumPosts.length === 0) {
      this.freshFetchBy(this.sortOption, 2);
    }
  }

  ngOnDestroy(): void {
    this.previousLoadedPostsSvc.save(this.forumPosts, this.sortOption, this.fetchedAll);
  }

  public fetchMorePosts(fresh = false, nbPosts = 1): void {
    if (fresh) {
      this.previousLoadedPostsSvc.reset();
    }

    switch (this.sortOption) {
      case SortOption.MostRecent:
        this.fetchPostsByMostRecent(nbPosts, fresh);
        break;
      case SortOption.OldestFirst:
        this.fetchPostsByOldestFirst(nbPosts, fresh);
        break;
      default:
        console.error('Not implemented sort option: ' + this.sortOption);
        break;
    }
  }

  public freshFetchBy(sortOption: SortOption, nbPosts: number) {
    this.sortOption = sortOption;
    this.forumPosts = [];
    this.fetchedAll = false;
    this.fetchMorePosts(true, nbPosts);
  }

  private fetchPostsByMostRecent(nbPosts: number, initial = false): void {
    if (!this.fetchedAll && !this.fetching) {
      this.fetching = true;
      this.forumSvc.getMostRecentPosts(nbPosts, initial)
        .then(posts => {
          if (posts.length === 0) {
            this.fetchedAll = true;
          } else {
            this.forumPosts = this.forumPosts.concat(posts);
          }
        })
        .catch(err => {
          console.error('Could not fetch posts: ', err);
        })
        .finally(() => this.fetching = false);
    }
  }

  private fetchPostsByOldestFirst(nbPosts: number, initial = false): void {
    if (!this.fetchedAll && !this.fetching) {
      this.fetching = true;
      this.forumSvc.getOldestPosts(nbPosts, initial)
        .then(posts => {
          if (posts.length === 0) {
            this.fetchedAll = true;
          } else {
            this.forumPosts = this.forumPosts.concat(posts);
          }
        })
        .catch(err => {
          console.error('Could not fetch posts: ', err);
        })
        .finally(() => this.fetching = false);
    }
  }

}
