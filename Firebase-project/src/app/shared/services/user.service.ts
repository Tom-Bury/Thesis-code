import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../interfaces/user/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currUserDoc: AngularFirestoreDocument<User>;
  private currUserDataObs: Observable<User>;
  private currUserData: User;
  private currUID: string;

  constructor(
    private afStore: AngularFirestore
  ) { }

  public loginUser(uid: string): void {
    this.currUID = uid;
    this.currUserDoc = this.afStore.doc('users/' + uid);
    this.currUserDataObs = this.currUserDoc.valueChanges();
    this.currUserDataObs.subscribe(v => this.currUserData = v);
  }

  public logOutUser(): void {
    this.currUID = null;
    this.currUserDoc = null;
    this.currUserData = null;
    this.currUserDataObs = null;
  }

  public getUserEmail(): string {
    if (this.currUserData) {
      return this.currUserData.email;
    } else {
      console.error('No user registered in user service');
      return 'no-user@error.com';
    }
  }
}
