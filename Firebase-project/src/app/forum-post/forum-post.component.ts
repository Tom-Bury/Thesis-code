import {
  Component,
  OnInit
} from '@angular/core';
import {
  ForumComment
} from '../shared/interfaces/forum/forum-comment.model';
import {
  Location
} from '@angular/common';
import {
  Like
} from '../shared/interfaces/forum/like.model';
import {
  ForumPost
} from '../shared/interfaces/forum/forum-post.model';
import {
  User
} from '../shared/interfaces/user/user.model';
import {
  animateCSS
} from '../shared/global-functions';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss']
})
export class ForumPostComponent implements OnInit {

  liked = false;

  dummyThread = [];

  post: ForumPost = null;



  constructor(
    private location: Location
  ) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  likePost(): void {
    if (!this.liked) {
      animateCSS('#like-icon', 'bounceIn', null);
    }
    this.liked = !this.liked;
  }

}
