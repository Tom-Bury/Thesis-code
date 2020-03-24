import { Injectable } from '@angular/core';
import { ForumPost } from '../shared/interfaces/forum/forum-post.model';
import { AllUsersService } from '../shared/services/all-users.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentPostService {


  private currPost: ForumPost;

  constructor(
    private allUsersSvc: AllUsersService
  ) { }


  setCurrPost(post: ForumPost): void {
    this.currPost = post;
  }

  getCurrPost(): ForumPost {
    return this.currPost;
  }

  getUserOfPost(): string {
    return this.allUsersSvc.getNameOfUser(this.currPost.uid);
  }
}
