import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FirestoreService } from './firestore.service';
import { ForumPost } from '../interfaces/forum/forum-post.model';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { CollectionReference } from '@angular/fire/firestore';

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
    const newPost = new ForumPost(title, content, currUserRef.ref);
    this.db.create$(this.FORUM_COLLECTION, newPost, ForumPost.toFirestore);
  }

  getAllPosts(): Observable<ForumPost[]> {
    return this.db.col$<ForumPost>(this.FORUM_COLLECTION, ForumPost.fromFirestore);
  }

  getMostRecentPosts(n = 3): Observable<ForumPost[]> {
    const queryFn = ref => ref.orderBy('createdAt', 'desc').limit(n);
    return this.db.col$<ForumPost>(this.FORUM_COLLECTION, ForumPost.fromFirestore, queryFn);
  }


}
