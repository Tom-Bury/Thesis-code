import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../interfaces/user/user.model';
import { Observable, Subscription } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private currUserDoc: AngularFirestoreDocument<User>;
  private currUserDataSubscription: Subscription;
  private currUserData: User;
  private currUID: string;

  constructor(
    // private afStore: AngularFirestore
    private db: FirestoreService
  ) { }

  public loginUser(uid: string): void {
    this.currUID = uid;
    this.currUserDataSubscription = this.db.doc$<User>('users/' + uid).subscribe(v => this.currUserData = v);
  }

  public logOutUser(): void {
    if (this.currUID) {
      this.currUserDataSubscription.unsubscribe();
      this.currUserDataSubscription = null;
      this.currUID = null;
      // this.currUserDoc = null;
      this.currUserData = null;
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
      this.db.update$('users/' + this.currUID, newUserData, User.toFirestore);
    }
  }
}
