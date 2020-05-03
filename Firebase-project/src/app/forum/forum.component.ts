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
import {
  TipsService
} from '../shared/services/tips.service';
import {
  PostCategory
} from '../shared/interfaces/forum/post-category.model';
import {
  AutomaticPostCreationService
} from '../shared/services/automatic-post-creation.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit, OnDestroy {

  public showFab = false;

  public forumPosts: ForumPost[] = [];
  public fetchedAll = false;
  public fetching = false;
  private fetchingExtra = false;

  public createPostActiveOnInit = false;

  private sortOption: SortOption;
  private NB_INITIAL_POSTS = 5;
  public saveLoadedPostsOnLeave = true;

  public darkBackground = false;
  private filteredCategories: string[] = [];

  constructor(
    private forumSvc: ForumService,
    private previousLoadedPostsSvc: PreviousLoadedPostsService,
    private automaticPostsSvc: AutomaticPostCreationService,
    private tipsSvc: TipsService
  ) {}


  ngOnInit(): void {
    this.forumPosts = this.previousLoadedPostsSvc.getPreviouslyLoadedPosts();
    this.fetchedAll = this.previousLoadedPostsSvc.canLoadMore();
    this.sortOption = this.previousLoadedPostsSvc.getPreviousSortOption();

    this.createPostActiveOnInit = this.previousLoadedPostsSvc.activeCreatePostOnForumPageInit() || this.automaticPostsSvc.hasPostAvailable();

    if (this.createPostActiveOnInit) {
      this.focusOnCreatePost();
    }

    if (this.forumPosts.length === 0) {
      this.freshFetchBy(this.sortOption);
    }

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = () => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        if (!this.showFab) {
          this.showFab = true;
          animateCSS('#scrollFab', 'fadeInUp', null);
        }
      } else {
        if (this.showFab) {
          animateCSS('#scrollFab', 'fadeOutDown', () => this.showFab = false);
        }
      }
    };

  }

  ngOnDestroy(): void {
    window.onscroll = null;
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

    if (!this.fetchedAll && (!this.fetching || this.fetchingExtra)) {
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
            // Would be better to only fetch the posts by category from backend but this is faster to develop...
            const allowedPosts = posts.filter(p => this.postIsAllowedByCategoryFilter(p));
            if (allowedPosts.length === 0) {
              this.fetchingExtra = true;
              this.fetchMorePosts();
            } else {
              this.forumPosts = this.forumPosts.concat(allowedPosts);
            }
          }
        })
        .catch(err => {
          console.error('Could not fetch posts: ', err);
        })
        .finally(() => {
          this.fetching = false;
          this.fetchingExtra = false;
        });
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

  public filterByNewCategories(cats: PostCategory[]): void {
    this.filteredCategories = cats.map(c => c.toFirebaseString());
    this.forumPosts = [];
    this.fetchedAll = false;
    this.fetchMorePosts(true, this.NB_INITIAL_POSTS);
  }

  public postIsAllowedByCategoryFilter(post: ForumPost): boolean {
    let allowed = false;
    this.filteredCategories.forEach(cat => {
      if (post.categories.map(c => c.toFirebaseString()).includes(cat)) {
        allowed = true;
      }
    });
    return this.filteredCategories.length > 0 ? allowed : true;
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


  public scrollUp(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
