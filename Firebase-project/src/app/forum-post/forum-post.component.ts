import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
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
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ForumComment
} from '../shared/interfaces/forum/forum-comment.model';
import {
  UserService
} from '../shared/services/user.service';
import {
  ForumService
} from '../shared/services/forum.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  Observable, Subject
} from 'rxjs';
import {
  AllUsersService
} from '../shared/services/all-users.service';
import { CommentToThreadComponent } from './comment-to-thread/comment-to-thread.component';


declare let $: any;

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss']
})
export class ForumPostComponent implements OnInit {

  @ViewChild('modal') modal: ElementRef;
  @ViewChild('mainCommentTextArea') mainCommentTextArea: ElementRef;
  @ViewChild('commentThreadModal') commentThreadComp: CommentToThreadComponent;

  public post$: Observable < ForumPost > ;
  private currPostID: string;

  private liked = false;
  public commentForm = this.fb.group({
    content: ['', Validators.required]
  });
  public commentFormHighlighted = false;

  public modalCommentId = new Subject<string>();

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private currUser: UserService,
    private forumSvc: ForumService,
    public allUsers: AllUsersService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const postID = paramMap.get('postID');
      this.currPostID = postID;
      this.post$ = this.forumSvc.getPostObservable(postID);
      this.liked = this.currUser.userHasLikedPost(postID) !== 'false';
    });
  }

  goBack() {
    this.location.back();
  }

  likePost(): void {
    if (this.currPostID !== '') {
      this.liked = this.forumSvc.toggleLikeForPost(this.currPostID);
      if (this.liked) {
        animateCSS('#like-icon', 'bounceIn', null);
      }
    }
  }

  hasLikedPost(): boolean {
    return this.liked;
  }

  goToComment(): void {
    const scrollHeight = document.body.scrollHeight;
    const waitTime = window.innerHeight === scrollHeight ? 0 : Math.floor(scrollHeight / 3);
    window.scrollTo({
      top: scrollHeight,
      behavior: 'smooth'
    });
    setTimeout(() => {
      this.mainCommentTextArea.nativeElement.focus();
    }, waitTime);
  }

  submitComment(): void {
    if (this.commentForm.valid) {
      const commentContent = this.commentForm.value.content;
      const newComment = new ForumComment(this.currUser.getUID(), commentContent, this.currPostID);
      this.forumSvc.submitCommentForPost(this.currPostID, newComment);
      this.commentForm.reset();
    }
  }


  openModalFor(cmtID: string): void {
    $(this.modal.nativeElement).modal('show');
    this.commentThreadComp.focus();
    this.modalCommentId.next(cmtID);
  }

  closeModal(): void {
    $(this.modal.nativeElement).modal('hide');
  }
}
