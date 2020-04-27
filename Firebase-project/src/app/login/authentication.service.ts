import {
  Injectable,
  NgZone
} from '@angular/core';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  Router
} from '@angular/router';
import {
  UserService
} from '../shared/services/user.service';
import {
  FirestoreService
} from '../shared/services/firestore.service';
import {
  UserPrivate
} from '../shared/interfaces/user/user-private.model';
import {
  UserPublic
} from '../shared/interfaces/user/user-public.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public authStateChanged = new Subject<boolean>();

  private authenticated = false;
  private cameViaLogin = false;

  constructor(
    private afAuth: AngularFireAuth,
    private db: FirestoreService,
    private router: Router,
    private userSvc: UserService,
    private ngZone: NgZone
  ) {
    // Automatically register logged in user info in UserService
    afAuth.auth.onAuthStateChanged((user) => {
      // console.log('Auth state changed', user);
      if (user) {
        this.userSvc.onUserLogin(user.uid)
          .then(() => {
            // console.log('User data fetched & set');
            this.authenticated = true;
            this.authStateChanged.next(true);
            if (this.cameViaLogin) {
              this.cameViaLogin = false;
              ngZone.run(() => this.navigateToHome());
            }
          })
          .catch((err) => {
            this.authStateChanged.next(false);
            console.error('User logged in but could not fetch user data from DB', err);
            this.authenticated = false;
          });
      } else {
        this.userSvc.onUserLogout();
        this.authenticated = false;
        this.authStateChanged.next(false);
      }
    });
  }

  public getAuthStateChangedSubject(): Subject<boolean> {
    return this.authStateChanged;
  }


  // -------------------------
  // Public facing methods
  // -------------------------

  public signupNewUser(email: string, password: string, username: string): Promise < any > {
    let authStateUnsub;
    this.cameViaLogin = true;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        authStateUnsub = this.afAuth.auth.onAuthStateChanged((user) => {
          if (user) {
            return this.addNewUserInfoToDB(user.uid, email, username);
          } else {
            console.error('Coulnt create...');
            throw new Error('Could not get UID to fully register new user');
          }
        });
      })
      .finally(() => {
        authStateUnsub();
      });
  }

  public loginUser(email: string, password: string): Promise < firebase.auth.UserCredential > {
    this.cameViaLogin = true;
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


  public isAuthenticated(): boolean {
    return this.authenticated;
  }




  // -------------------------
  // Private methods
  // -------------------------

  private addNewUserInfoToDB(uid: string, newMail: string, newName: string): Promise < void > {
    const newUserPrivate = new UserPrivate(newMail, uid);
    const newUserPrivateDoc = this.db.getUsersPrivateCol().doc < UserPrivate > (uid);
    const newUserPublic = new UserPublic(newName, uid);
    const newUserPublicDoc = this.db.getUsersPublicCol().doc < UserPublic > (uid);

    const privPromise = this.db.createDoc$(newUserPrivateDoc, newUserPrivate, UserPrivate.toFirestore);
    const pubPromise = this.db.createDoc$(newUserPublicDoc, newUserPublic, UserPublic.toFirestore);

    return Promise.all([privPromise, pubPromise]).then();
  }

  private navigateToHome(): void {
    this.router.navigate(['/home']);
  }

}
