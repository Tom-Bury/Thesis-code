import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import {
  ForumPost
} from 'src/app/shared/interfaces/forum/forum-post.model';
import {
  AllUsersService
} from 'src/app/shared/services/all-users.service';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  UserService
} from 'src/app/shared/services/user.service';
import {
  ForumService
} from 'src/app/shared/services/forum.service';
import {
  Subscription
} from 'rxjs';

@Component({
  selector: 'app-forum-post-card',
  templateUrl: './forum-post-card.component.html',
  styleUrls: ['./forum-post-card.component.scss']
})
export class ForumPostCardComponent implements OnInit, OnDestroy {

  @Input() post: ForumPost;
  public userName = '';
  private sub: Subscription;

  constructor(
    private allUsersSvc: AllUsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private currUser: UserService,
    private forumSvc: ForumService
  ) {}

  ngOnInit(): void {
    this.userName = this.allUsersSvc.getNameOfUser(this.post.uid);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public routeToPost(): void {
    this.router.navigate(['post', this.post.getID()], {
      relativeTo: this.activatedRoute
    });
  }

  public hasLiked(): boolean {
    return this.currUser.userHasLikedPost(this.post.getID()) !== 'false';
  }

  public toggleLike(): void {
    if (!this.sub) {
      this.sub = this.forumSvc.getPostObservable(this.post.getID())
        .subscribe({
          next: (post) => {
            this.post = post;
            console.log(post);
          }
        });
    }
    this.forumSvc.toggleLikeForPost(this.post.getID());
  }

}
