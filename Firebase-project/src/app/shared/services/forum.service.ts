import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FirestoreService } from './firestore.service';
import { ForumPost } from '../interfaces/forum/forum-post.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private FORUM_COLLECTION = environment.forumDB;

  constructor(
    private db: FirestoreService,
    private currUser: UserService
  ) { }


  createNewPost(title: string, content: string): void {
    const currUserRef = this.currUser.getUserDocReference();
    const newPost = new ForumPost(title, content, currUserRef);
  }
}
