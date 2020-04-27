import { Component, OnInit, HostListener, Input } from '@angular/core';
import { ForumPost } from 'src/app/shared/interfaces/forum/forum-post.model';
import { ForumService } from 'src/app/shared/services/forum.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-your-posts-card',
  templateUrl: './your-posts-card.component.html',
  styleUrls: ['./your-posts-card.component.scss']
})
export class YourPostsCardComponent implements OnInit {

  @Input() collapseable = true;

  public yourPosts$: Observable<ForumPost[]>;

  public isXLScreen = true;
  public isToggledOpen = false;

  constructor(
    private forumSvc: ForumService,
    private currUser: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isXLScreen = window.innerWidth >= 1200;
    this.yourPosts$ = this.forumSvc.getAllPostsByUser(this.currUser.getUID());
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isXLScreen = window.innerWidth >= 1200;
  }

  public toggleLikeForOwnPost(postID: string): void {
    this.forumSvc.toggleLikeForPost(postID);
  }

  public likedOwnPost(postID: string): boolean {
    return this.currUser.userHasLikedPost(postID) !== 'false';
  }

  public routeToPost(postID: string): void {
    this.router.navigate(['forum', 'post', postID]);
  }

}
