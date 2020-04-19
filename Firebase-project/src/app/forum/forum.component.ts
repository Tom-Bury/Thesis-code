import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  ForumService
} from '../shared/services/forum.service';
import {
  ForumPost
} from '../shared/interfaces/forum/forum-post.model';
import {
  PreviousLoadedPostsService
} from './previous-loaded-posts.service';
import {
  SortOption
} from './sort-option.enum';
import {
  animateCSS
} from '../shared/global-functions';
import { TipsService } from '../shared/services/tips.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit, OnDestroy {

  public forumPosts: ForumPost[] = [];
  public fetchedAll = false;
  public fetching = false;

  public createPostActiveOnInit = false;

  private sortOption: SortOption;
  private NB_INITIAL_POSTS = 5;
  public saveLoadedPostsOnLeave = true;

  public darkBackground = false;

  constructor(
    private forumSvc: ForumService,
    private previousLoadedPostsSvc: PreviousLoadedPostsService,
    private tipsSvc: TipsService
  ) {}


  ngOnInit(): void {
    this.forumPosts = this.previousLoadedPostsSvc.getPreviouslyLoadedPosts();
    this.fetchedAll = this.previousLoadedPostsSvc.canLoadMore();
    this.sortOption = this.previousLoadedPostsSvc.getPreviousSortOption();

    this.createPostActiveOnInit = this.previousLoadedPostsSvc.activeCreatePostOnForumPageInit();

    if (this.createPostActiveOnInit) {
      this.focusOnCreatePost();
    }

    if (this.forumPosts.length === 0) {
      this.freshFetchBy(this.sortOption);
    }
  }

  ngOnDestroy(): void {
    if (this.saveLoadedPostsOnLeave) {
      this.previousLoadedPostsSvc.save(this.forumPosts, this.sortOption, this.fetchedAll);
    } else {
      this.previousLoadedPostsSvc.reset();
    }
  }

  public fetchMorePosts(fresh = false, nbPosts = 1): void {
    if (fresh && !this.createPostActiveOnInit) {
      this.previousLoadedPostsSvc.reset();
    }

    if (!this.fetchedAll && !this.fetching) {
      this.fetching = true;
      let postsPromise: Promise < ForumPost[] > ;

      switch (this.sortOption) {
        case SortOption.MostRecent:
          postsPromise = this.forumSvc.getMostRecentPosts(nbPosts, fresh);
          break;
        case SortOption.OldestFirst:
          postsPromise = this.forumSvc.getOldestPosts(nbPosts, fresh);
          break;
        case SortOption.MostLikes:
          postsPromise = this.forumSvc.getMostLikedPosts(nbPosts, fresh);
          break;
        case SortOption.MostComments:
          postsPromise = this.forumSvc.getMostCommentedPosts(nbPosts, fresh);
          break;
        default:
          console.error('Not implemented sort option: ' + this.sortOption);
          return;
      }

      postsPromise.then(posts => {
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

  public freshFetchBy(sortOption: SortOption) {
    this.sortOption = sortOption;
    this.forumPosts = [];
    this.fetchedAll = false;
    this.fetchMorePosts(true, this.NB_INITIAL_POSTS);
  }

  public newPostWasMade(): void {
    this.saveLoadedPostsOnLeave = false;
    this.hideBackdrop();
  }

  public focusOnCreatePost(): void {
    this.showBackdrop();
  }

  public removeFocusOnCreatePost(): void {
    this.hideBackdrop();
  }

  private showBackdrop(): void {
    document.getElementById('create-post-backdrop').style.display = 'block';
    this.tipsSvc.disableTips();
  }

  private hideBackdrop(): void {
    document.getElementById('create-post-backdrop').style.animation = 'myFadeOut 0.2s';
    setTimeout(() => {
      document.getElementById('create-post-backdrop').style.display = 'none';
      document.getElementById('create-post-backdrop').style.animation = 'myFadeIn 0.2s';
      this.tipsSvc.enableTips();
    }, 200);
    this.darkBackground = false;
  }
}
