import {
  Injectable
} from '@angular/core';
import {
  FirestoreService
} from './firestore.service';
import {
  ForumPost
} from '../interfaces/forum/forum-post.model';
import {
  UserService
} from './user.service';
import {
  Observable
} from 'rxjs';
import {
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import {
  ForumComment
} from '../interfaces/forum/forum-comment.model';
import {
  firestore
} from 'firebase';
import {
  tap
} from 'rxjs/operators';
import {
  PostLike
} from '../interfaces/forum/post-like.model';
import { CommentLike } from '../interfaces/forum/comment-like.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private FORUM_COLLECTION: AngularFirestoreCollection < ForumPost > ;
  private COMMENTS_COLLECTION: AngularFirestoreCollection < ForumComment > ;
  private POST_LIKES_COLLECTION: AngularFirestoreCollection < PostLike > ;
  private COMMENTS_LIKES_COLLECTION: AngularFirestoreCollection<CommentLike>;

  constructor(
    private db: FirestoreService,
    private currUser: UserService
  ) {
    this.FORUM_COLLECTION = this.db.getForumPostsCol();
    this.COMMENTS_COLLECTION = this.db.getForumCommentsCol();
    this.POST_LIKES_COLLECTION = this.db.getForumPostLikesCol();
    this.COMMENTS_LIKES_COLLECTION = this.db.getForumCommentLikesCol();
  }

  // == ---------
  // == POSTS
  // == ---------

  createNewPost(title: string, content: string): void {
    const uid = this.currUser.getUID();
    const newPost = new ForumPost(title, content, uid);
    this.db.createDocAutoId$(this.FORUM_COLLECTION, newPost, ForumPost.toFirestore); // TODO: add success/error feedback
  }

  getAllPosts(): Observable < ForumPost[] > {
    return this.db.getCollObs < ForumPost > (this.FORUM_COLLECTION, ForumPost.fromFirestore);
  }

  getPostObservable(postID: string): Observable < ForumPost > {
    return this.db.getDocObs < ForumPost > (this.FORUM_COLLECTION.doc(postID), ForumPost.fromFirestore);
  }

  getMostRecentPosts(n = 3): Observable < ForumPost[] > {
    const queryFn = ref => ref.orderBy('createdAt', 'desc').limit(n);
    const collQuery = this.db.getForumPostsCol(queryFn);
    return this.db.getCollObs < ForumPost > (collQuery, ForumPost.fromFirestore);
  }


  // == -----------
  // == COMMENTS
  // == -----------

  getCommentObservable(commentID: string): Observable < ForumComment > {
    return this.db.getDocObs(this.COMMENTS_COLLECTION.doc(commentID), ForumComment.fromFirestore);
  }

  getCommentsObservable(commentIDs: string[]): Observable < ForumComment[] > {
    const queryFn = ref => ref.where(firestore.FieldPath.documentId(), 'in', commentIDs);
    return this.db.getCollObs(this.db.getForumCommentsCol(queryFn), ForumComment.fromFirestore)
      .pipe(tap(results => {
        results.sort((a, b) => a.getCreatedAt().toMillis() - b.getCreatedAt().toMillis());
      }));
  }


  submitCommentForPost(postId: string, comment: ForumComment): void {
    this.db.createDocAutoId$(this.COMMENTS_COLLECTION, comment, ForumComment.toFirestore)
      .then(commentRef => {
        const postDocRef = this.FORUM_COLLECTION.doc(postId);
        this.db.updateDocArrayField$(postDocRef, 'comments', commentRef.id);
      });
  }

  submitCommentForComment(commentID: string, comment: ForumComment): void {
    this.db.createDocAutoId$(this.COMMENTS_COLLECTION, comment, ForumComment.toFirestore)
      .then(commentRef => {
        const commentDocRef = this.COMMENTS_COLLECTION.doc(commentID);
        this.db.updateDocArrayField$(commentDocRef, 'comments', commentRef.id);
      });
  }


  // == ----------------
  // == LIKES - posts
  // == ----------------

  submitLikeForPost(postID: string, like: PostLike): Promise<string> {
    return new Promise((resolve, reject) => {
      this.db.createDocAutoId$<PostLike>(this.POST_LIKES_COLLECTION, like, PostLike.toFirestore)
      .then(likeRef => {
        const postDocRef = this.FORUM_COLLECTION.doc(postID);
        this.db.updateDocArrayField$(postDocRef, 'likes', likeRef.id);

        this.db.updateDocArrayField$(this.currUser.getUserDocReference(), 'postLikes', {likeID: likeRef.id, postID: postID});

        resolve(likeRef.id);
      });
    });
  }

  removeLikeFromPost(postID: string, likeID: string): void {
    this.db.removeDocArrayField$(this.FORUM_COLLECTION.doc(postID), 'likes', likeID);
    this.db.removeDocArrayField$(this.currUser.getUserDocReference(), 'postLikes', {likeID, postID});
    this.db.removeDoc$(this.POST_LIKES_COLLECTION.doc(likeID));
  }

    // == -----------------
  // == LIKES - comments
  // == -------------------

  submitLikeForComment(commentID: string, like: CommentLike): Promise<string> {
    return new Promise((resolve, reject) => {
      this.db.createDocAutoId$<CommentLike>(this.COMMENTS_LIKES_COLLECTION, like, CommentLike.toFirestore)
      .then(likeRef => {
        const commentDocRef = this.COMMENTS_COLLECTION.doc(commentID);
        this.db.updateDocArrayField$(commentDocRef, 'likes', likeRef.id);

        this.db.updateDocArrayField$(this.currUser.getUserDocReference(), 'commentLikes', {likeID: likeRef.id, commentID: commentID});

        resolve(likeRef.id);
      });
    });
  }

  removeLikeFromComment(commentID: string, likeID: string): void {
    this.db.removeDocArrayField$(this.COMMENTS_COLLECTION.doc(commentID), 'likes', likeID);
    this.db.removeDocArrayField$(this.currUser.getUserDocReference(), 'commentLikes', {likeID, commentID});
    this.db.removeDoc$(this.COMMENTS_LIKES_COLLECTION.doc(likeID));
  }




}
