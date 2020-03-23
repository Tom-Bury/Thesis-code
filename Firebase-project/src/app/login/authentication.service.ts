import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { User } from '../shared/interfaces/user/user.model';
import { rejects } from 'assert';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUser: firebase.User;
  private authenticated = false;
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private router: Router,
    private userSvc: UserService
  ) {
    afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        this.userSvc.loginUser(user.uid);
        this.authenticated = true;
      } else {
        this.currentUser = null;
        this.userSvc.logOutUser();
        this.authenticated = false;
      }
    });

    this.usersCollection = afStore.collection<User>('users');
  }


  // -------------------------
  // Public facing methods
  // -------------------------

  public signupNewUser(email: string, password: string, username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let authStateUnsub: firebase.Unsubscribe;
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(res => {
          authStateUnsub = this.afAuth.auth.onAuthStateChanged((user) => {
            if (user) {
              this.addNewUserInfoToDB(user.uid, email, username);
            } else {
              console.error('Coulnt create...');
              reject('Could not create new user');
            }
          });
        }).catch(err => {
          console.error(err);

          reject(err)})
        .finally(() => {
          authStateUnsub();
        });
    });
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
    if (environment.needsAuthentication) {
      return this.authenticated;
    } else {
      return true;
    }
  }




  // -------------------------
  // Private methods
  // -------------------------

  private addNewUserInfoToDB(uid: string, userEmail: string, username: string): Promise<void> {
    const newUser = new User(
      userEmail,
      username,
      uid,
      undefined,
      undefined,
      [],
      []
    );
    return this.usersCollection.doc(uid).set(User.userConverter.toFirestore(newUser));
  }

}
