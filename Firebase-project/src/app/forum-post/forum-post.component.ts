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
import { CurrentPostService } from './current-post.service';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss']
})
export class ForumPostComponent implements OnInit {

  liked = false;
  public post: ForumPost;
  public userName = '';

  constructor(
    private location: Location,
    public currPostSvc: CurrentPostService
  ) {}

  ngOnInit(): void {
    this.post = this.currPostSvc.getCurrPost();
    this.userName = this.currPostSvc.getUserOfPost();
  }

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
