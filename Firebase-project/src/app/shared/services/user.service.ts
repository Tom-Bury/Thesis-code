import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../interfaces/user/user.model';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currUserDoc: AngularFirestoreDocument<User>;
  private currUserDataSubscription: Subscription;
  private currUserData: User;
  private currUID: string;

  constructor(
    private afStore: AngularFirestore
  ) { }

  public loginUser(uid: string): void {
    this.currUID = uid;
    this.currUserDoc = this.afStore.doc('users/' + uid);
    this.currUserDataSubscription = this.currUserDoc.valueChanges().subscribe(v => this.currUserData = v);
  }

  public logOutUser(): void {
    if (this.currUID) {
      this.currUserDataSubscription.unsubscribe();
      this.currUserDataSubscription = null;
      this.currUID = null;
      this.currUserDoc = null;
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
}
