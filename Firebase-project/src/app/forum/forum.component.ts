import {
  Component,
  OnInit
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

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  public forumPosts: ForumPost[] = [];
  public fetchedAll = false;
  public fetching = false;

  constructor(
    private forumSvc: ForumService,
    private allUsersSvc: AllUsersService
  ) {}


  ngOnInit() {
    this.fetching = true;
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

    this.allUsersSvc.refresh();
  }

  fetchMorePosts() {
    if (!this.fetchedAll) {
      this.fetching = true;
      this.forumSvc.getMostRecentPosts(2)
        .then(posts => {
          if (posts.length > 0) {
            this.forumPosts = this.forumPosts.concat(posts);
          } else {
            this.fetchedAll = true;
          }
        })
        .catch(err => {
          console.error('Could not fetch additional posts: ', err);
          this.fetchedAll = true;
        })
        .finally(() => this.fetching = false);
    }
  }

}
