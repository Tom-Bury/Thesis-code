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
import { FormBuilder, Validators } from '@angular/forms';
import { ForumComment } from '../shared/interfaces/forum/forum-comment.model';
import { UserService } from '../shared/services/user.service';
import { ForumService } from '../shared/services/forum.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PostLike } from '../shared/interfaces/forum/post-like.model';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss']
})
export class ForumPostComponent implements OnInit {

  liked = false;

  public post$: Observable<ForumPost>;
  private currPostID = '';
  public userName = '';
  public commentForm = this.fb.group({
    content: ['', Validators.required]
  });


  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private currUser: UserService,
    private forumSvc: ForumService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( paramMap => {
      const postID = paramMap.get('postID');
      this.currPostID = postID;
      this.post$ = this.forumSvc.getPostObservable(postID);
    });
  }

  goBack() {
    this.location.back();
  }

  likePost(): void {
    if (!this.liked && this.currPostID !== '') {
      animateCSS('#like-icon', 'bounceIn', null);
      const newLike = new PostLike(this.currUser.getUID(), this.currPostID);
      this.forumSvc.submitLikeForPost(this.currPostID, newLike);
    }
    this.liked = !this.liked;
  }

  goToComment(): void {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  submitComment(): void {
    if (this.commentForm.valid) {
      const commentContent = this.commentForm.value.content;
      const newComment = new ForumComment(this.currUser.getUID(), commentContent, this.currPostID);
      this.forumSvc.submitCommentForPost(this.currPostID, newComment);
      this.commentForm.reset();
    }
  }

}
