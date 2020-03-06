import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUser: firebase.User;
  private authenticated = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        this.authenticated = true;
      } else {
        this.currentUser = null;
        this.authenticated = false;
      }
    });
  }


  public signupNewUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  public loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public logoutUser(): void {
    this.afAuth.auth.signOut()
      .then(() => {
        console.log('Succesfully logged out.');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Could not log out', error);
      });
  }

  public getUser(): firebase.User {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }
}
