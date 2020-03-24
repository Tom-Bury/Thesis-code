import {
  Component,
  OnInit
} from '@angular/core';
import {
  Location
} from '@angular/common';
import {
  ForumPost
} from '../shared/interfaces/forum/forum-post.model';
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
