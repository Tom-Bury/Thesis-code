import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { ForumPost } from '../interfaces/forum/forum-post.model';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private FORUM_COLLECTION: AngularFirestoreCollection<ForumPost>;

  constructor(
    private db: FirestoreService,
    private currUser: UserService
  ) {
    this.FORUM_COLLECTION = this.db.getForumPostsCol();
  }


  createNewPost(title: string, content: string): void {
    const uid = this.currUser.getUID();
    const newPost = new ForumPost(title, content, uid);
    this.db.createDocAutoId$(this.FORUM_COLLECTION, newPost, ForumPost.toFirestore); // TODO: add success/error feedback
  }

  getAllPosts(): Observable<ForumPost[]> {
    // return this.db.col$<ForumPost>(this.FORUM_COLLECTION, ForumPost.fromFirestore);
    return this.db.getCollObs<ForumPost>(this.FORUM_COLLECTION, ForumPost.fromFirestore);
  }

  getMostRecentPosts(n = 3): Observable<ForumPost[]> {
    const queryFn = ref => ref.orderBy('createdAt', 'desc').limit(n);
    const collQuery = this.db.getForumPostsCol(queryFn);
    return this.db.getCollObs<ForumPost>(collQuery, ForumPost.fromFirestore);
    // return this.db.col$<ForumPost>(this.FORUM_COLLECTION, ForumPost.fromFirestore, queryFn);

  }


}
