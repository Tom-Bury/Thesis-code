import {
  Injectable,
} from '@angular/core';
import {
  Subscription,
} from 'rxjs';
import {
  FirestoreService
} from './firestore.service';
import {
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {
  UserPublic
} from '../interfaces/user/user-public.model';
import { UserPrivate } from '../interfaces/user/user-private.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currUserPublicDoc: AngularFirestoreDocument < UserPublic > ;
  private currUserPublicSub: Subscription;
  private currUserPublicData: UserPublic;

  private currUserLikedPosts: string[];
  private currUserLikedPostIDToLikeID = {};

  private currUserLikedComments: string[];
  private currUserLikedCommentIDToLikeID = {};

  private currUID: string;

  private curruserPrivateDoc: AngularFirestoreDocument<UserPrivate>;
  private currUserPrivateSub: Subscription;
  private currUserPrivateData: UserPrivate;

  private score = 0;


  constructor(
    private db: FirestoreService
  ) { }

  public onUserLogin(uid: string): Promise < void > {
    this.currUID = uid;
    return new Promise((resolve, reject) => {

      this.currUserPublicDoc = this.db.getUsersPublicCol().doc < UserPublic > (uid);
      this.currUserPublicSub = this.db.getDocObs<UserPublic>(this.currUserPublicDoc, UserPublic.fromFirestore)
        .subscribe(
          v => {
            this.currUserPublicData = v;
            this.currUserLikedPosts = null;
            this.currUserLikedPostIDToLikeID = {};
            this.currUserLikedComments = null;
            this.currUserLikedCommentIDToLikeID = {};
            this.score = v.score.amount;
            resolve();
          },
          err => reject(err));
    })
    .then(() => {
      this.curruserPrivateDoc = this.db.getUsersPrivateCol().doc<UserPrivate>(uid);
      this.currUserPrivateSub = this.db.getDocObs<UserPrivate>(this.curruserPrivateDoc, UserPrivate.fromFirestore)
        .subscribe(
          v => {
            this.currUserPrivateData = v;
          });
    });
  }

  public onUserLogout(): void {
    if (this.currUID) {
      this.currUserPublicDoc = null;
      this.currUserPublicSub.unsubscribe();
      this.currUserPublicSub = null;
      this.currUserPublicData = null;

      this.currUID = null;

      this.curruserPrivateDoc = null;
      this.currUserPrivateSub.unsubscribe();
      this.currUserPrivateSub = null;
      this.currUserPrivateData = null;
    }
  }

  public getUserEmail(): string {
    if (this.currUID) {
      return this.currUserPrivateData.email;
    } else {
      console.error('No user registered in user service');
      return 'no-user@error.com';
    }
  }

  public getUserName(): string {
    if (this.currUID) {
      return this.currUserPublicData.name;
    } else {
      console.error('No user registered in user service');
      return 'no-username-error';
    }
  }

  public getUID(): string {
    if (this.currUID) {
      return this.currUID;
    } else {
      console.error('No user registered in user service');
      return 'no-UID-error';
    }
  }

  public userHasForumAccess(): boolean {
    const result = this.currUserPrivateData ? this.currUserPrivateData.hasForumAccess : false;
    return result;
  }

  public userHasLikedPost(postID: string): string {
    if (this.currUserLikedPosts === null) {
      this.currUserLikedPosts = this.currUserPublicData.postLikes.map(like => {
        this.currUserLikedPostIDToLikeID[like.postID] = like.likeID;
        return like.postID;
      });
    }
    return this.currUserLikedPosts.includes(postID) ? this.currUserLikedPostIDToLikeID[postID] : 'false';
  }

  public userHasLikedComment(commentID: string): string {
    if (this.currUserLikedComments === null) {
      this.currUserLikedComments = this.currUserPublicData.commentLikes.map(like => {
        this.currUserLikedCommentIDToLikeID[like.commentID] = like.likeID;
        return like.commentID;
      });
    }
    return this.currUserLikedComments.includes(commentID) ? this.currUserLikedCommentIDToLikeID[commentID] : 'false';
  }



  public getUserDocReference(): AngularFirestoreDocument < UserPublic > {
    if (this.currUID) {
      return this.currUserPublicDoc;
    } else {
      console.error('No user registered in user service');
      return null;
    }
  }

  public getUserScore(): number {
    return this.score;
  }

  public increaseScore(n: number): void {
    this.score += n;
  }

  public decreaseScore(n: number): void {
    this.score -= n;
  }
}
