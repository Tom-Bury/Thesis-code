import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private afAuth: AngularFireAuth
  ) { }


  public signupNewUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  public loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public getUser(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

  public isLoggedIn(): boolean {
    if (this.afAuth.auth.currentUser) {
      return true;
    } else {
      return false;
    }
  }
}
