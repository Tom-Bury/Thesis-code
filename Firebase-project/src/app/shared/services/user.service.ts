import {
  Injectable,
} from '@angular/core';
import {
  User
} from '../interfaces/user/user.model';
import {
  Subscription,
  Observable
} from 'rxjs';
import {
  FirestoreService
} from './firestore.service';
import {
  environment
} from 'src/environments/environment';
import {
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import {
  UserPublic
} from '../interfaces/user/user-public.model';
import { UserPrivate } from '../interfaces/user/user-private.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersPublicColl: AngularFirestoreCollection < UserPublic > ;

  private currUserPublicDoc: AngularFirestoreDocument < UserPublic > ;
  private currUserPublicSub: Subscription;
  private currUserPublicData: UserPublic;

  private currUID: string;

  private curruserPrivateDoc: AngularFirestoreDocument<UserPrivate>;
  private currUserPrivateSub: Subscription;
  private currUserPrivateData: UserPrivate;


  constructor(
    private db: FirestoreService
  ) {
    this.usersPublicColl = db.getUsersPublicCol();
  }

  public onUserLogin(uid: string): Promise < void > {
    this.currUID = uid;
    return new Promise((resolve, reject) => {

      this.currUserPublicDoc = this.db.getUsersPublicCol().doc < UserPublic > (uid);
      this.currUserPublicSub = this.db.getDocObs<UserPublic>(this.currUserPublicDoc, UserPublic.fromFirestore)
        .subscribe(
          v => {
            this.currUserPublicData = v;
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

  public updateUserName(newName: string): void {
    // if (this.currUserData) {
    //   const newUserData = this.currUserData;
    //   newUserData.name = newName;
    //   console.log('OLD USER DATA', this.currUserData);
    //   console.log('NEW USER DATA', newUserData);
    //   this.db.update$(this.USERS_COLLECTION + this.currUID, newUserData, User.toFirestore);
    // }
  }

  public getUserDocReference(): AngularFirestoreDocument < UserPublic > {
    if (this.currUID) {
      return this.currUserPublicDoc;
    } else {
      console.error('No user registered in user service');
      return null;
    }
    return null;
  }
}
