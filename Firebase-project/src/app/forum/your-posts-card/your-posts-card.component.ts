import { Component, OnInit, HostListener } from '@angular/core';
import { ForumPost } from 'src/app/shared/interfaces/forum/forum-post.model';
import { ForumService } from 'src/app/shared/services/forum.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-your-posts-card',
  templateUrl: './your-posts-card.component.html',
  styleUrls: ['./your-posts-card.component.scss']
})
export class YourPostsCardComponent implements OnInit {

  public yourPosts$: Observable<ForumPost[]>;

  public isXLScreen = true;
  public isToggledOpen = false;

  constructor(
    private forumSvc: ForumService,
    private currUser: UserService
  ) {}

  ngOnInit(): void {
    this.isXLScreen = window.innerWidth >= 1200;
    this.yourPosts$ = this.forumSvc.getAllPostsByUser(this.currUser.getUID());
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isXLScreen = window.innerWidth >= 1200;
  }


}
