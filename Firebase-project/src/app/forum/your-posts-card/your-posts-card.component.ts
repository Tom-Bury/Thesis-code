import { Component, OnInit, HostListener } from '@angular/core';
import { ForumPost } from 'src/app/shared/interfaces/forum-post.model';
import { User } from 'src/app/shared/interfaces/user/user.model';
import { Like } from 'src/app/shared/interfaces/like.model';
import { ForumComment } from 'src/app/shared/interfaces/forum-comment.model';

@Component({
  selector: 'app-your-posts-card',
  templateUrl: './your-posts-card.component.html',
  styleUrls: ['./your-posts-card.component.scss']
})
export class YourPostsCardComponent implements OnInit {

  yourPosts: ForumPost[] = [
    new ForumPost('This is my first post', 'Some content', new User('Tom'), [new Like(null, null), new Like(null, null)], [new ForumComment('User 1', 'This is my comment!', 'some date', [new Like(null, null), new Like(null, null)], [], '1'), new ForumComment('User 1', 'This is my comment!', 'some date', [new Like(null, null), new Like(null, null)], [], '1')]),
    new ForumPost('This is my second post', 'Some content', new User('Tom'), [new Like(null, null), new Like(null, null)], [new ForumComment('User 1', 'This is my comment!', 'some date', [new Like(null, null), new Like(null, null)], [], '1'), new ForumComment('User 1', 'This is my comment!', 'some date', [new Like(null, null), new Like(null, null)], [], '1')]),
    new ForumPost('This is my third post', 'Some content', new User('Tom'), [new Like(null, null), new Like(null, null)], [new ForumComment('User 1', 'This is my comment!', 'some date', [new Like(null, null), new Like(null, null)], [], '1'), new ForumComment('User 1', 'This is my comment!', 'some date', [new Like(null, null), new Like(null, null)], [], '1')]),
    new ForumPost('This is my fourth post', 'Some content', new User('Tom'), [new Like(null, null), new Like(null, null)], [new ForumComment('User 1', 'This is my comment!', 'some date', [new Like(null, null), new Like(null, null)], [], '1'), new ForumComment('User 1', 'This is my comment!', 'some date', [new Like(null, null), new Like(null, null)], [], '1')]),
  ];

  public isXLScreen = true;
  public isToggledOpen = false;

  constructor() {}

  ngOnInit(): void {
    this.isXLScreen = window.innerWidth >= 1200;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isXLScreen = window.innerWidth >= 1200;
  }


}
