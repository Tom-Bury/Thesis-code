import { Component, OnInit, Input } from '@angular/core';
import { ForumPost } from 'src/app/shared/interfaces/forum/forum-post.model';
import { AllUsersService } from 'src/app/shared/services/all-users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-forum-post-card',
  templateUrl: './forum-post-card.component.html',
  styleUrls: ['./forum-post-card.component.scss']
})
export class ForumPostCardComponent implements OnInit {

  @Input() post: ForumPost;
  public userName = '';

  constructor(
    private allUsersSvc: AllUsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private currUser: UserService
  ) {
  }

  ngOnInit(): void {
    this.userName = this.allUsersSvc.getNameOfUser(this.post.uid);
  }

  public routeToPost(): void {
    this.router.navigate(['post', this.post.getID()], {relativeTo: this.activatedRoute});
  }

  public hasLiked(): boolean {
    return this.currUser.userHasLikedPost(this.post.getID()) !== 'false';
  }

}
