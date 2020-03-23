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
import { AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USERS_COLLECTION = environment.usersDB;
  private currUserDataSubscription: Subscription;
  private currUserData: User;
  private currUID: string;
  private currUserDocRef: AngularFirestoreDocument<User>;

  constructor(
    private db: FirestoreService
  ) {}

  public onUserLogin(uid: string): Promise < void > {
    this.currUID = uid;
    return new Promise((resolve, reject) => {
      this.currUserDataSubscription = this.db.doc$ < User > (this.USERS_COLLECTION + uid)
        .subscribe(
          v => {
            this.currUserDocRef = this.db.doc<User>(this.USERS_COLLECTION + uid);
            this.currUserData = v;
            resolve();
          },
          err => reject(err));
    });
  }

  public onUserLogout(): void {
    if (this.currUID) {
      this.currUserDataSubscription.unsubscribe();
      this.currUserDataSubscription = null;
      this.currUID = null;
      this.currUserData = null;
      this.currUserDocRef = null;
    }
  }

  public getUserEmail(): string {
    if (this.currUserData) {
      return this.currUserData.email;
    } else {
      console.error('No user registered in user service');
      return 'no-user@error.com';
    }
  }

  public getUserName(): string {
    if (this.currUserData) {
      return this.currUserData.name;
    } else {
      console.error('No user registered in user service');
      return 'no-username-error';
    }
  }

  public updateUserName(newName: string): void {
    if (this.currUserData) {
      const newUserData = this.currUserData;
      newUserData.name = newName;
      console.log('OLD USER DATA', this.currUserData);
      console.log('NEW USER DATA', newUserData);
      this.db.update$(this.USERS_COLLECTION + this.currUID, newUserData, User.toFirestore);
    }
  }

  public getUserDocReference(): AngularFirestoreDocument<User> {
    if (this.currUserData) {
      return this.currUserDocRef;
    } else {
      console.error('No user registered in user service');
      return null;
    }
  }
}
